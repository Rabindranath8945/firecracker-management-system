"use client";

import { useEffect, useState } from "react";

import { Capacitor } from "@capacitor/core";

import { initializeDatabase } from "../api/database";
import { initializeSyncManager } from "../sync/sync.manager";

interface OfflineInitializerProps {
  children: React.ReactNode;
}

export default function OfflineInitializer({
  children,
}: OfflineInitializerProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cleanupSync: (() => void) | undefined;

    async function initialize() {
      try {
        if (Capacitor.isNativePlatform()) {
          await initializeDatabase();

          cleanupSync = initializeSyncManager();
        }
      } catch (error) {
        console.error("Failed to initialize offline system:", error);
      } finally {
        setReady(true);
      }
    }

    void initialize();

    return () => {
      cleanupSync?.();
    };
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />

          <p className="mt-3 text-sm text-muted-foreground">
            Starting OneHub...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
