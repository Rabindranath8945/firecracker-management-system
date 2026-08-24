"use client";

import {
  AppWindow,
  Check,
  Loader2,
  Lock,
  Shield,
  Smartphone,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";

import { createPortal } from "react-dom";

import { useProfile } from "../hooks/useProfile";

interface SecurityDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function SecurityDialog({ open, onClose }: SecurityDialogProps) {
  const { profile, updating, updateProfile, error } = useProfile();

  const [mounted, setMounted] = useState(false);

  const [appLockEnabled, setAppLockEnabled] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);

  useEffect(() => {
    if (!profile) {
      return;
    }

    setAppLockEnabled(profile.appLockEnabled);
  }, [profile]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!mounted || !open) {
    return null;
  }

  async function handleAppLockChange(enabled: boolean) {
    try {
      setAppLockEnabled(enabled);

      await updateProfile({
        // Profile update endpoint should not
        // be used for security settings if your
        // backend has a dedicated security endpoint.
      });
    } catch {
      setAppLockEnabled(profile?.appLockEnabled ?? false);
    }
  }

  return createPortal(
    <div
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-end
        justify-center
        bg-slate-950/60
        px-0
        backdrop-blur-sm
        sm:items-center
        sm:px-4
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="security-dialog-title"
        className="
          relative
          max-h-[92vh]
          w-full
          max-w-lg
          overflow-hidden
          rounded-t-[2rem]
          bg-white
          shadow-2xl
          dark:bg-slate-950
          sm:rounded-[2rem]
        "
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        {/* Header */}

        <div
          className="
            border-b
            border-slate-100
            px-5
            py-4
            dark:border-slate-800
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    bg-violet-50
                    text-violet-600
                    dark:bg-violet-950/40
                    dark:text-violet-400
                  "
                >
                  <Shield className="h-4 w-4" />
                </div>

                <div>
                  <h2
                    id="security-dialog-title"
                    className="
                      text-base
                      font-bold
                      text-slate-900
                      dark:text-white
                    "
                  >
                    Security
                  </h2>

                  <p className="text-[11px] text-slate-500">
                    Protect your account and device
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close security"
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                text-slate-400
                transition
                hover:bg-slate-100
                hover:text-slate-700
                dark:hover:bg-slate-900
              "
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}

        <div className="max-h-[calc(92vh-80px)] overflow-y-auto p-5">
          {/* Security Status */}

          <div
            className="
              rounded-2xl
              border
              border-emerald-100
              bg-emerald-50/60
              p-4
              dark:border-emerald-900/40
              dark:bg-emerald-950/20
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-emerald-100
                  text-emerald-600
                  dark:bg-emerald-950/50
                  dark:text-emerald-400
                "
              >
                <Check className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  Account Secure
                </p>

                <p className="mt-0.5 text-[11px] text-emerald-600/80 dark:text-emerald-500">
                  Your account is currently active.
                </p>
              </div>
            </div>
          </div>

          {/* App Lock */}

          <section className="mt-6">
            <div className="mb-3 flex items-center gap-2">
              <Lock className="h-4 w-4 text-violet-500" />

              <h3
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-500
                "
              >
                App Lock
              </h3>
            </div>

            <div
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-4
                dark:border-slate-800
                dark:bg-slate-900
              "
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-violet-50
                      text-violet-600
                      dark:bg-violet-950/40
                      dark:text-violet-400
                    "
                  >
                    <Lock className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-white">
                      App Lock
                    </p>

                    <p className="mt-0.5 text-[11px] text-slate-500">
                      Require a lock when opening the app.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={updating}
                  onClick={() => void handleAppLockChange(!appLockEnabled)}
                  className={`
                    relative
                    h-6
                    w-11
                    shrink-0
                    rounded-full
                    transition
                    ${
                      appLockEnabled
                        ? "bg-violet-600"
                        : "bg-slate-300 dark:bg-slate-700"
                    }
                  `}
                >
                  <span
                    className={`
                      absolute
                      top-0.5
                      h-5
                      w-5
                      rounded-full
                      bg-white
                      shadow
                      transition
                      ${appLockEnabled ? "left-[22px]" : "left-0.5"}
                    `}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Device */}

          <section className="mt-6">
            <div className="mb-3 flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-sky-500" />

              <h3
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-500
                "
              >
                Device
              </h3>
            </div>

            <div
              className="
                rounded-2xl
                border
                border-slate-200
                dark:border-slate-800
              "
            >
              <SecurityRow
                icon={<Smartphone className="h-4 w-4" />}
                label="Device"
                value={profile?.deviceId ? "Registered" : "Not registered"}
              />

              <SecurityRow
                icon={<AppWindow className="h-4 w-4" />}
                label="Onboarding"
                value={profile?.onboardingCompleted ? "Completed" : "Pending"}
              />
            </div>
          </section>

          {error && (
            <div
              className="
                mt-5
                rounded-xl
                border
                border-red-200
                bg-red-50
                px-3
                py-2.5
                text-xs
                font-medium
                text-red-600
                dark:border-red-900/50
                dark:bg-red-950/30
                dark:text-red-400
              "
            >
              {error}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

interface SecurityRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function SecurityRow({ icon, label, value }: SecurityRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-3 last:border-b-0 dark:border-slate-800">
      <div className="flex items-center gap-3">
        <span className="text-slate-400">{icon}</span>

        <span className="text-xs text-slate-500">{label}</span>
      </div>

      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
        {value}
      </span>
    </div>
  );
}
