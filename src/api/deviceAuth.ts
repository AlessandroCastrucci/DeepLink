const WORKER_BASE_URL = "https://smartvideo-cors-proxy.matteoburgassi.workers.dev";
const DEEPLINK_BASE_URL = "https://deeplink.blast.dvbuilder.com/pair";

interface DeviceCodeResponse {
  code: string;
  expiresIn: number;
}

interface DevicePollResponse {
  status: "pending" | "complete" | "expired";
  user?: {
    code: string;
    error: number;
    data: {
      "0": {
        user_id: string;
        email: string | null;
        firstname?: string | null;
        lastname?: string | null;
        nickname?: string | null;
        dve_login: string | null;
        subscribed: boolean | null;
        total_credit: string | null;
        token?: Array<{
          token: string;
          content: string;
          token_type: string;
          immutable: boolean;
          date_start: string;
        }>;
        offer?: Array<unknown>;
        suspended?: boolean;
      };
    };
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
