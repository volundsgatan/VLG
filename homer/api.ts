export interface WebsocketMessage {
  topic: string;
}

export interface BridgeDevicesMessage {
  payload: BridgeDevicesPayload[];
  topic: string;
}

export interface BridgeDevicesPayload {
  definition?: Definition;
  disabled: boolean;
  endpoints: Endpoints;
  friendly_name: string;
  ieee_address: string;
  interview_completed: boolean;
  interviewing: boolean;
  network_address: number;
  supported: boolean;
  type: string;
  date_code?: string;
  description?: string;
  manufacturer?: string;
  model_id?: string;
  power_source?: string;
  software_build_id?: string;
}

export interface Definition {
  description: string;
  exposes: Expose[];
  model: string;
  options: Option[];
  supports_ota: boolean;
  vendor: string;
}

export interface Expose {
  features?: Feature[];
  type: string;
  access?: number;
  description?: string;
  name?: string;
  property?: string;
  values?: string[];
  unit?: string;
  value_max?: number;
  value_min?: number;
  value_off?: boolean;
  value_on?: boolean;
  item_type?: ItemType;
  length_max?: number;
  length_min?: number;
}

export interface Feature {
  access: number;
  description: string;
  name: string;
  property: string;
  type: string;
  value_off?: string;
  value_on?: string;
  value_toggle?: string;
  value_max?: number;
  value_min?: number;
  presets?: Preset[];
  unit?: string;
  features?: Feature2[];
}

export interface Preset {
  description: string;
  name: string;
  value: number;
}

export interface Feature2 {
  access: number;
  description?: string;
  name: string;
  property: string;
  type: string;
  presets?: Preset2[];
  value_max?: number;
  value_min?: number;
}

export interface Preset2 {
  description: string;
  name: string;
  value: number;
}

export interface ItemType {
  access: string;
  name: string;
  type: string;
}

export interface Option {
  access: number;
  description: string;
  name: string;
  property: string;
  type: string;
  value_off?: boolean;
  value_on?: boolean;
  value_max?: number;
  value_min?: number;
  features?: Feature3[];
}

export interface Feature3 {
  access: number;
  description: string;
  name: string;
  property: string;
  type: string;
  value_min: number;
  unit?: string;
}

export interface Binding {
  cluster: string;
  target: Target;
}

export interface Target {
  endpoint: number;
  ieee_address: string;
  type: string;
}

export interface Clusters {
  input: string[];
  output: string[];
}

export interface DeviceEventPayload {
  device: Device;
}

export interface OccupancyPayload extends DeviceEventPayload {
  battery: number;
  illuminance_above_threshold: boolean;
  last_seen: number;
  linkquality: number;
  occupancy: boolean;
  // requested_brightness_level: any
  // requested_brightness_percent: any
  update: Update;
  update_available: boolean;
}

export interface LightPayload extends DeviceEventPayload {
  // ballast_maximum_level: null;
  // ballast_minimum_level: null;
  // ballast_status_lamp_failure: false;
  // ballast_status_non_operational: false;
  brightness: number;
  state: "ON" | "OFF";
}

export interface Device {
  applicationVersion: number;
  dateCode: string;
  friendlyName: string;
  hardwareVersion: number;
  ieeeAddr: string;
  manufacturerID: number;
  manufacturerName: string;
  model: string;
  networkAddress: number;
  powerSource: string;
  softwareBuildID: string;
  stackVersion: number;
  type: string;
  zclVersion: number;
}

export interface Update {
  installed_version: number;
  latest_version: number;
  state: string;
}
