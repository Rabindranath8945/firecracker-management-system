import { v4 as uuid } from "uuid";

const DEVICE_ID_KEY = "firecracker_device_id";

class DeviceService {
  /**
   * Returns the unique device/installation ID.
   * Creates it on first run and stores it locally.
   */
  getDeviceId(): string {
    if (typeof window === "undefined") {
      return "";
    }

    let deviceId = localStorage.getItem(DEVICE_ID_KEY);

    if (!deviceId) {
      deviceId = uuid();

      localStorage.setItem(DEVICE_ID_KEY, deviceId);
    }

    return deviceId;
  }

  /**
   * Removes the device ID.
   * Normally used only during logout or development.
   */
  clearDeviceId(): void {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.removeItem(DEVICE_ID_KEY);
  }
}

export const deviceService = new DeviceService();
