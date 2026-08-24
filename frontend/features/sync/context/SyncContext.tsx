"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import syncService from "../services/sync.service";

import type { SyncState } from "../types/sync.types";

interface SyncContextValue extends SyncState {
  syncNow: () => Promise<void>;
}

const SyncContext = createContext<SyncContextValue | undefined>(undefined);

const STORAGE_KEY = "erp_sync_state";

const DEFAULT_STATE: SyncState = {
  status: "IDLE",
  pendingChanges: 0,
  lastSyncedAt: null,
  lastError: null,
};

function getInitialState(): SyncState {
  if (typeof window === "undefined") {
    return DEFAULT_STATE;
  }

  try {
    const cached = localStorage.getItem(STORAGE_KEY);

    if (cached) {
      return {
        ...DEFAULT_STATE,
        ...JSON.parse(cached),
      };
    }
  } catch (error) {
    console.error("Failed to read sync state:", error);
  }

  return DEFAULT_STATE;
}

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SyncState>(getInitialState);

  /* ---------------------------------------------------------------------- */
  /* Persist state                                                          */
  /* ---------------------------------------------------------------------- */

  const persistState = useCallback((next: SyncState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (error) {
      console.error("Failed to save sync state:", error);
    }
  }, []);

  /* ---------------------------------------------------------------------- */
  /* Update state                                                           */
  /* ---------------------------------------------------------------------- */

  const updateState = useCallback(
    (next: SyncState) => {
      setState(next);
      persistState(next);
    },
    [persistState],
  );

  /* ---------------------------------------------------------------------- */
  /* Sync                                                                    */
  /* ---------------------------------------------------------------------- */

  const syncNow = useCallback(async () => {
    if (!navigator.onLine) {
      setState((current) => {
        if (current.status === "OFFLINE") {
          return current;
        }

        const next: SyncState = {
          ...current,
          status: "OFFLINE",
          lastError: null,
        };

        persistState(next);

        return next;
      });

      return;
    }

    setState((current) => {
      const next: SyncState = {
        ...current,
        status: "SYNCING",
        lastError: null,
      };

      persistState(next);

      return next;
    });

    try {
      const result = await syncService.sync();

      setState((current) => {
        const next: SyncState = {
          ...current,

          status: result.failedCount > 0 ? "ERROR" : "SYNCED",

          pendingChanges: result.failedCount,

          lastSyncedAt: result.syncedAt,

          lastError:
            result.failedCount > 0
              ? `${result.failedCount} changes failed to sync.`
              : null,
        };

        persistState(next);

        return next;
      });
    } catch (error) {
      console.error("Sync failed:", error);

      setState((current) => {
        const next: SyncState = {
          ...current,
          status: "ERROR",
          lastError: "Unable to synchronize data.",
        };

        persistState(next);

        return next;
      });
    }
  }, [persistState]);

  /* ---------------------------------------------------------------------- */
  /* Network events                                                         */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    function handleOffline() {
      setState((current) => {
        /*
         * IMPORTANT:
         * Do not update state if we are already offline.
         * This prevents unnecessary renders.
         */

        if (current.status === "OFFLINE") {
          return current;
        }

        const next: SyncState = {
          ...current,
          status: "OFFLINE",
          lastError: null,
        };

        persistState(next);

        return next;
      });
    }

    function handleOnline() {
      /*
       * Network is back.
       * Automatically synchronize.
       */
      void syncNow();
    }

    if (!navigator.onLine) {
      handleOffline();
    }

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [persistState, syncNow]);

  /* ---------------------------------------------------------------------- */
  /* Initial online sync                                                    */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (navigator.onLine) {
      void syncNow();
    }
  }, [syncNow]);

  return (
    <SyncContext.Provider
      value={{
        ...state,
        syncNow,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/* Hook                                                                       */
/* -------------------------------------------------------------------------- */

export function useSync() {
  const context = useContext(SyncContext);

  if (!context) {
    throw new Error("useSync must be used inside SyncProvider.");
  }

  return context;
}
