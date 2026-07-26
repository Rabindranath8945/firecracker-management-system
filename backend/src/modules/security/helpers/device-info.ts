export interface DeviceInfo {
  deviceName: string;

  platform: string;

  osVersion: string;

  appVersion: string;

  ipAddress: string;
}

export function getDeviceInfo(device: DeviceInfo) {
  return device;
}
