type Device = {
  addresses: string[];
  user: string;
  name: string;
  hostname: string;
  ndoeId: string;
};

type DevicesResponse = {
  devices: Device[];
};

const TS_API_KEY = Deno.env.get("TS_API_KEY");

if (!TS_API_KEY) {
  console.log("TS_API_KEY not set");
  Deno.exit(1);
}

const whoami = async (ip: string): Promise<Device | undefined> => {
  const jsonResponse = await fetch(
    "https://api.tailscale.com/api/v2/tailnet/-/devices?fields=all",
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${TS_API_KEY}`,
      },
    },
  );

  const devices = await jsonResponse.json() as DevicesResponse;

  const device = devices.devices.find((device) =>
    device.addresses.includes(ip)
  );

  if (!device) {
    console.log(`No device found for IP ${ip}`);
    return;
  }

  return device;
};

const server = Deno.listen({ port: 8080 });
console.log(`HTTP webserver running on :8080`);

for await (const conn of server) {
  serveHttp(conn);
}

async function serveHttp(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);
  for await (const requestEvent of httpConn) {
    const ip = requestEvent.request.headers.get("x-forwarded-for");
    if (!ip) {
      requestEvent.respondWith(
        new Response("No IP found", { status: 400 }),
      );
      return;
    }

    const d = await whoami(ip);

    requestEvent.respondWith(
      new Response(JSON.stringify(d), {
        status: 200,
      }),
    );
  }
}
