const WORKER_BASE_URL = "https://smartvideo-cors-proxy.matteoburgassi.workers.dev";
const DEEPLINK_BASE_URL = "https://deeplink.blast.dvbuilder.com/pair";

interface DeviceCodeResponse {
  code: string;
  expiresIn: number;
}

interface DevicePollResponse {
  status: "pending" | "complete" | "expired";
  user?: {
    id: string;
    email: string | null;
    subscribed: boolean | null;
    token: string;
  };
}

export async function requestDeviceCode(): Promise<DeviceCodeResponse> {
  const response = await fetch(`${WORKER_BASE_URL}/device/code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to request device code: ${response.status}`);
  }

  return response.json();
}

export async function pollDeviceAuth(code: string): Promise<DevicePollResponse> {
  const response = await fetch(`${WORKER_BASE_URL}/device/poll?code=${encodeURIComponent(code)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to poll device auth: ${response.status}`);
  }

  return response.json();
}

export function buildPairingDeeplink(code: string): string {
  return `${DEEPLINK_BASE_URL}?code=${code}`;
}
