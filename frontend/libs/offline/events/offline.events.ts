"use client";

import { Capacitor } from "@capacitor/core";

export const OFFLINE_DATA_CHANGED_EVENT = "onehub:offline-data-changed";

export function notifyOfflineDataChanged(): void {
  if (typeof window === "undefined" || !Capacitor.isNativePlatform()) {
    return;
  }

  window.dispatchEvent(new CustomEvent(OFFLINE_DATA_CHANGED_EVENT));
}
