"use client";

import { syncPendingItems } from "../services/sync.service";

let initialized = false;

export function initializeSyncManager(): () => void {
  if (initialized || typeof window === "undefined") {
    return () => {};
  }

  initialized = true;

  const handleOnline = () => {
    void syncPendingItems();
  };

  window.addEventListener("online", handleOnline);

  // Try to sync immediately if internet is available.
  if (navigator.onLine) {
    void syncPendingItems();
  }

  return () => {
    window.removeEventListener("online", handleOnline);
    initialized = false;
  };
}
