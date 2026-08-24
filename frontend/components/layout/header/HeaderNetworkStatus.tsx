"use client";

import {
  Cloud,
  CloudOff,
  Loader2,
  Server,
  ServerOff,
  Wifi,
  WifiOff,
} from "lucide-react";

import { useNetworkStatus } from "@/features/network/hooks/useNetworkStatus";
import { useBackendStatus } from "@/features/network/hooks/useBackendStatus";

export default function HeaderNetworkStatus() {
  const { isOnline } = useNetworkStatus();

  const { status: backendStatus, isConnected, isChecking } = useBackendStatus();

  /*
   * Completely offline
   */
  if (!isOnline) {
    return (
      <div
        className="
          flex
          items-center
          gap-2
          rounded-full
          border
          border-amber-400/20
          bg-amber-400/10
          px-3
          py-1.5
          text-amber-300
          transition-all
          duration-300
        "
      >
        <WifiOff className="h-3.5 w-3.5" />

        <span className="relative flex h-2 w-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-amber-400" />
        </span>

        <span className="text-[11px] font-semibold">Offline</span>

        <CloudOff className="h-3.5 w-3.5 opacity-70" />
      </div>
    );
  }

  /*
   * Internet available but backend is checking
   */
  if (isChecking || backendStatus === "checking") {
    return (
      <div
        className="
          flex
          items-center
          gap-2
          rounded-full
          border
          border-sky-400/20
          bg-sky-400/10
          px-3
          py-1.5
          text-sky-300
        "
      >
        <Loader2 className="h-3.5 w-3.5 animate-spin" />

        <span className="text-[11px] font-semibold">Checking</span>
      </div>
    );
  }

  /*
   * Internet available but backend unavailable
   */
  if (!isConnected) {
    return (
      <div
        className="
          flex
          items-center
          gap-2
          rounded-full
          border
          border-red-400/20
          bg-red-400/10
          px-3
          py-1.5
          text-red-300
          transition-all
          duration-300
        "
      >
        <ServerOff className="h-3.5 w-3.5" />

        <span className="relative flex h-2 w-2">
          <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-red-400" />
        </span>

        <span className="text-[11px] font-semibold">Server Offline</span>
      </div>
    );
  }

  /*
   * Internet + backend available
   */
  return (
    <div
      className="
        flex
        items-center
        gap-2
        rounded-full
        border
        border-emerald-400/20
        bg-emerald-400/10
        px-3
        py-1.5
        text-emerald-300
        shadow-sm
        transition-all
        duration-300
      "
    >
      <span className="relative flex h-2 w-2">
        <span
          className="
            absolute
            inline-flex
            h-full
            w-full
            animate-ping
            rounded-full
            bg-emerald-400
            opacity-60
          "
        />

        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>

      <Wifi className="h-3.5 w-3.5" />

      <span className="text-[11px] font-semibold">Online</span>

      <Server className="h-3.5 w-3.5 opacity-70" />

      <Cloud className="h-3.5 w-3.5 opacity-70" />
    </div>
  );
}
