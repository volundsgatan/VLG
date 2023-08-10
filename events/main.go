package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"sync"
	"time"

	"nhooyr.io/websocket"
	"nhooyr.io/websocket/wsjson"
)

/*
	{
	   "payload":{
	      "battery":null,
	      "contact":true,
	      "device":{
	         "applicationVersion":3,
	         "dateCode":"20161128",
	         "friendlyName":"Bedroom Window Sensor",
	         "hardwareVersion":2,
	         "ieeeAddr":"0x00158d00090d3d69",
	         "manufacturerID":4151,
	         "manufacturerName":"LUMI",
	         "model":"MCCGQ11LM", // contact sensor!
	         "networkAddress":3406,
	         "powerSource":"Battery",
	         "softwareBuildID":"3000-0001",
	         "stackVersion":2,
	         "type":"EndDevice",
	         "zclVersion":1
	      },
	      "device_temperature":null,
	      "last_seen":1691679136308,
	      "linkquality":175,
	      "power_outage_count":null,
	      "voltage":null
	   },
	   "topic":"Bedroom Window Sensor"
	}
*/
type Z2mEvent struct {
	Payload json.RawMessage `json:"payload"`
	Topic   string          `json:"topic"`
}

type ContactSensorPayload struct {
	// Battery any  `json:"battery"`
	Contact *bool `json:"contact"`
	Device  struct {
		// 	ApplicationVersion int    `json:"applicationVersion"`
		// 	DateCode           string `json:"dateCode"`
		FriendlyName string `json:"friendlyName"`
		// 	HardwareVersion    int    `json:"hardwareVersion"`
		IeeeAddr string `json:"ieeeAddr"`
		// 	ManufacturerID     int    `json:"manufacturerID"`
		// 	ManufacturerName   string `json:"manufacturerName"`
		Model          string `json:"model"`
		NetworkAddress int    `json:"networkAddress"`
		// 	PowerSource        string `json:"powerSource"`
		SoftwareBuildID string `json:"softwareBuildID"`
		// 	StackVersion       int    `json:"stackVersion"`
		Type string `json:"type"`
		// 	ZclVersion         int    `json:"zclVersion"`
	} `json:"device"`
	// DeviceTemperature any   `json:"device_temperature"`
	// LastSeen          int64 `json:"last_seen"`
	// Linkquality       int   `json:"linkquality"`
	// PowerOutageCount  any   `json:"power_outage_count"`
	// Voltage           any   `json:"voltage"`
}

func main() {
	events := NewEvents()

	go z2msubscriber(events)
	go api(events)
	select {}
}

func api(events *Events) {
	http.HandleFunc("/list", func(w http.ResponseWriter, r *http.Request) {
		j, err := json.Marshal(events.Latest())
		if err != nil {
			log.Println(fmt.Errorf("failed to marshal events: %+v", err))
			return
		}
		if _, err := w.Write(j); err != nil {
			log.Println(fmt.Errorf("failed to write request response: %+v", err))
		}
	})

	log.Fatal(http.ListenAndServe(":8080", nil))
}

func z2msubscriber(events *Events) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Minute)
	defer cancel()

	c, _, err := websocket.Dial(ctx, "wss://zigbee2mqtt.unicorn-alligator.ts.net/api", nil)
	if err != nil {
		log.Fatalf("failed to dial z2m: %+v", err)
	}

	c.SetReadLimit(32769 * 100)

	for {
		var event Z2mEvent
		if err := wsjson.Read(ctx, c, &event); err != nil {
			log.Println(fmt.Errorf("failed to read message: %w", err))
			break
		}

		var sensor ContactSensorPayload
		if err := json.Unmarshal(event.Payload, &sensor); err == nil {
			if sensor.Contact == nil {
				continue
			}
			if sensor.Device.Model != "MCCGQ11LM" {
				continue
			}

			// is sensor!
			fmt.Println("sensor!", sensor.Contact, sensor.Device.Model, sensor.Device.FriendlyName)
			events.Add(Event{
				Type:         Contact,
				Timestamp:    time.Now(),
				FriendlyName: sensor.Device.FriendlyName,
				IeeeAddr:     sensor.Device.IeeeAddr,
				Data:         ContactEvent{Contact: *sensor.Contact},
			})
		}
	}

	c.Close(websocket.StatusNormalClosure, "")
}

type Events struct {
	events []Event
	mx     sync.RWMutex
	fp     *os.File
}

func NewEvents() *Events {
	fp, err := os.OpenFile("events.jsonl", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		log.Println(err)
	}

	return &Events{
		events: []Event{},
		mx:     sync.RWMutex{},
		fp:     fp,
	}
}

type EventType string

const (
	Contact EventType = "contact"
)

type Event struct {
	Type         EventType
	Timestamp    time.Time
	Data         any
	IeeeAddr     string
	FriendlyName string
}

type ContactEvent struct {
	Contact bool
}

func (e *Events) Add(ev Event) {
	e.mx.Lock()
	e.events = append(e.events, ev)
	e.mx.Unlock()

	// persist
	if js, err := json.Marshal(ev); err == nil {
		_, err := e.fp.WriteString(string(js) + "\n")
		if err != nil {
			log.Println("failed to append to log:", err)
		}
	}
}

func (e *Events) Latest() []Event {
	e.mx.RLock()
	defer e.mx.RUnlock()

	start := 0
	if len(e.events) > 100 {
		start = len(e.events) - 100
	}

	return e.events[start:]
}
