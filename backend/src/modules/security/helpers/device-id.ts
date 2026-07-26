import crypto from "crypto";

export function generateDeviceId(): string {
  return crypto.randomUUID();
}
