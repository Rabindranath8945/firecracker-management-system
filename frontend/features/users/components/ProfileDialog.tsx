"use client";

import {
  Check,
  Edit3,
  Loader2,
  Mail,
  Phone,
  Shield,
  UserRound,
  X,
} from "lucide-react";

import { type ReactNode, useEffect, useState } from "react";

import { createPortal } from "react-dom";

import ProfileAvatar from "./ProfileAvatar";

import { useProfile } from "../hooks/useProfile";

import type { UpdateProfileInput } from "../types/profile.types";

interface ProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function ProfileDialog({ open, onClose }: ProfileDialogProps) {
  const { profile, loading, updating, error, updateProfile } = useProfile();

  const [mounted, setMounted] = useState(false);

  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState<UpdateProfileInput>({
    firstName: "",
    lastName: "",
    mobile: "",
  });

  /* ------------------------------------------------------------------------ */
  /* Mount Portal                                                             */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Sync Profile With Form                                                   */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!profile) {
      return;
    }

    setForm({
      firstName: profile.firstName ?? "",
      lastName: profile.lastName ?? "",
      mobile: profile.mobile ?? "",
    });
  }, [profile]);

  /* ------------------------------------------------------------------------ */
  /* Reset Editing State                                                      */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!open) {
      setEditing(false);
    }
  }, [open]);

  /* ------------------------------------------------------------------------ */
  /* Escape Key                                                               */
  /* ------------------------------------------------------------------------ */

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

  /* ------------------------------------------------------------------------ */
  /* Save Profile                                                             */
  /* ------------------------------------------------------------------------ */

  async function handleSave() {
    try {
      await updateProfile(form);

      setEditing(false);
    } catch {
      // useProfile already stores the error.
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Form Change                                                              */
  /* ------------------------------------------------------------------------ */

  function handleChange(field: keyof UpdateProfileInput, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  /* ------------------------------------------------------------------------ */
  /* Cancel Editing                                                           */
  /* ------------------------------------------------------------------------ */

  function handleCancel() {
    if (!profile) {
      return;
    }

    setEditing(false);

    setForm({
      firstName: profile.firstName ?? "",
      lastName: profile.lastName ?? "",
      mobile: profile.mobile ?? "",
    });
  }

  /* ------------------------------------------------------------------------ */
  /* Don't Render                                                             */
  /* ------------------------------------------------------------------------ */

  if (!mounted || !open) {
    return null;
  }

  /* ------------------------------------------------------------------------ */
  /* Loading                                                                   */
  /* ------------------------------------------------------------------------ */

  if (loading) {
    return createPortal(
      <div
        className="
          fixed
          inset-0
          z-[9999]
          flex
          items-center
          justify-center
          bg-slate-950/60
          px-4
          backdrop-blur-sm
        "
      >
        <div
          className="
            flex
            h-48
            w-full
            max-w-md
            items-center
            justify-center
            rounded-3xl
            bg-white
            shadow-2xl
            dark:bg-slate-950
          "
        >
          <div className="text-center">
            <Loader2 className="mx-auto h-7 w-7 animate-spin text-sky-500" />

            <p className="mt-3 text-xs font-semibold text-slate-500">
              Loading profile...
            </p>
          </div>
        </div>
      </div>,
      document.body,
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Profile Unavailable                                                       */
  /* ------------------------------------------------------------------------ */

  if (!profile) {
    return createPortal(
      <div
        className="
          fixed
          inset-0
          z-[9999]
          flex
          items-center
          justify-center
          bg-slate-950/60
          px-4
          backdrop-blur-sm
        "
      >
        <div
          className="
            relative
            w-full
            max-w-md
            rounded-3xl
            bg-white
            p-6
            shadow-2xl
            dark:bg-slate-950
          "
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close profile"
            className="
              absolute
              right-4
              top-4
              flex
              h-8
              w-8
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

          <div className="py-8 text-center">
            <UserRound className="mx-auto h-10 w-10 text-slate-400" />

            <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
              Profile unavailable
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              {error ?? "Unable to load your profile."}
            </p>
          </div>
        </div>
      </div>,
      document.body,
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Profile Data                                                              */
  /* ------------------------------------------------------------------------ */

  const firstName = profile.firstName?.trim() ?? "";

  const lastName = profile.lastName?.trim() ?? "";

  const fullName =
    `${firstName} ${lastName}`.trim() || profile.email?.split("@")[0] || "User";

  const roleLabel =
    profile.role.charAt(0) + profile.role.slice(1).toLowerCase();

  const isOwner = profile.role === "OWNER" || profile.isOwner;

  const permissionCount = profile.permissions?.length ?? 0;

  /* ------------------------------------------------------------------------ */
  /* Main Dialog                                                               */
  /* ------------------------------------------------------------------------ */

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
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-dialog-title"
        className="
          relative
          flex
          max-h-[92vh]
          w-full
          max-w-lg
          flex-col
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
        {/* ---------------------------------------------------------------- */}
        {/* Header                                                            */}
        {/* ---------------------------------------------------------------- */}

        <div
          className="
            shrink-0
            border-b
            border-slate-100
            bg-white
            px-5
            py-4
            dark:border-slate-800
            dark:bg-slate-950
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <h2
                id="profile-dialog-title"
                className="
                  text-base
                  font-bold
                  text-slate-900
                  dark:text-white
                "
              >
                My Profile
              </h2>

              <p className="mt-0.5 text-[11px] text-slate-500">
                Manage your account information
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close profile"
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

        {/* ---------------------------------------------------------------- */}
        {/* Scrollable Content                                                */}
        {/* ---------------------------------------------------------------- */}

        <div className="overflow-y-auto">
          <div className="px-5 pb-6 pt-6">
            {/* ------------------------------------------------------------ */}
            {/* Profile Summary                                                */}
            {/* ------------------------------------------------------------ */}

            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <ProfileAvatar
                  src={profile.profilePicture}
                  name={fullName}
                  size="lg"
                />

                <span
                  className="
                    absolute
                    bottom-0
                    right-0
                    h-3
                    w-3
                    rounded-full
                    border-2
                    border-white
                    bg-emerald-500
                    dark:border-slate-950
                  "
                />
              </div>

              <div className="min-w-0 flex-1">
                <h3
                  className="
                    truncate
                    text-lg
                    font-bold
                    text-slate-900
                    dark:text-white
                  "
                >
                  {fullName}
                </h3>

                <p className="mt-0.5 truncate text-xs text-slate-500">
                  {profile.email}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span
                    className="
                      rounded-full
                      bg-sky-50
                      px-2.5
                      py-1
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wide
                      text-sky-600
                      dark:bg-sky-950/40
                      dark:text-sky-400
                    "
                  >
                    {roleLabel}
                  </span>

                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1
                      rounded-full
                      bg-emerald-50
                      px-2.5
                      py-1
                      text-[10px]
                      font-bold
                      text-emerald-600
                      dark:bg-emerald-950/40
                      dark:text-emerald-400
                    "
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                    {profile.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {!editing && (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="
                    flex
                    h-9
                    shrink-0
                    items-center
                    gap-1.5
                    rounded-xl
                    border
                    border-slate-200
                    px-3
                    text-xs
                    font-semibold
                    text-slate-600
                    transition
                    hover:bg-slate-50
                    dark:border-slate-800
                    dark:text-slate-300
                    dark:hover:bg-slate-900
                  "
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit
                </button>
              )}
            </div>

            {/* ------------------------------------------------------------ */}
            {/* Personal Information                                           */}
            {/* ------------------------------------------------------------ */}

            <section className="mt-7">
              <div className="mb-3 flex items-center gap-2">
                <UserRound className="h-4 w-4 text-sky-500" />

                <h4
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-500
                  "
                >
                  Personal Information
                </h4>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <ProfileField
                  label="First Name"
                  value={form.firstName ?? ""}
                  editing={editing}
                  onChange={(value) => handleChange("firstName", value)}
                />

                <ProfileField
                  label="Last Name"
                  value={form.lastName ?? ""}
                  editing={editing}
                  onChange={(value) => handleChange("lastName", value)}
                />

                <ProfileField
                  label="Email"
                  value={profile.email}
                  icon={<Mail className="h-3.5 w-3.5" />}
                />

                <ProfileField
                  label="Mobile"
                  value={form.mobile ?? ""}
                  editing={editing}
                  onChange={(value) => handleChange("mobile", value)}
                  icon={<Phone className="h-3.5 w-3.5" />}
                />
              </div>
            </section>

            {/* ------------------------------------------------------------ */}
            {/* Account                                                         */}
            {/* ------------------------------------------------------------ */}

            <section className="mt-7">
              <div className="mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4 text-violet-500" />

                <h4
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-500
                  "
                >
                  Account
                </h4>
              </div>

              <div
                className="
                  divide-y
                  divide-slate-100
                  rounded-2xl
                  border
                  border-slate-200
                  dark:divide-slate-800
                  dark:border-slate-800
                "
              >
                <AccountRow
                  label="Role"
                  value={isOwner ? "OWNER" : roleLabel}
                />

                <AccountRow
                  label="Account Status"
                  value={profile.isActive ? "Active" : "Inactive"}
                />

                <AccountRow
                  label="App Lock"
                  value={profile.appLockEnabled ? "Enabled" : "Disabled"}
                />

                <AccountRow
                  label="Last Login"
                  value={formatDate(profile.lastLogin)}
                />

                <AccountRow
                  label="Last Seen"
                  value={formatDate(profile.lastSeen)}
                />

                <AccountRow
                  label="Member Since"
                  value={formatDate(profile.createdAt)}
                />
              </div>
            </section>

            {/* ------------------------------------------------------------ */}
            {/* Access Summary                                                 */}
            {/* ------------------------------------------------------------ */}

            <section className="mt-7">
              <div className="mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-500" />

                <h4
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-500
                  "
                >
                  Access
                </h4>
              </div>

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
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {isOwner ? "Full Access" : "Module Access"}
                    </p>

                    <p className="mt-1 text-[11px] text-slate-500">
                      {isOwner
                        ? "Owner has access to all ERP modules."
                        : `${permissionCount} permissions assigned.`}
                    </p>
                  </div>

                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-white
                      text-emerald-500
                      shadow-sm
                      dark:bg-slate-900
                    "
                  >
                    <Shield className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </section>

            {/* ------------------------------------------------------------ */}
            {/* Permissions                                                    */}
            {/* ------------------------------------------------------------ */}

            <section className="mt-7">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-sky-500" />

                  <h4
                    className="
                      text-xs
                      font-bold
                      uppercase
                      tracking-wider
                      text-slate-500
                    "
                  >
                    Permissions
                  </h4>
                </div>

                <span
                  className="
                    rounded-full
                    bg-slate-100
                    px-2
                    py-1
                    text-[10px]
                    font-bold
                    text-slate-500
                    dark:bg-slate-900
                    dark:text-slate-400
                  "
                >
                  {isOwner ? "Full Access" : `${permissionCount}`}
                </span>
              </div>

              {profile.permissions.length === 0 ? (
                <div
                  className="
                    rounded-2xl
                    border
                    border-dashed
                    border-slate-200
                    px-4
                    py-5
                    text-center
                    dark:border-slate-800
                  "
                >
                  <p className="text-xs text-slate-500">
                    No permissions assigned.
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.permissions.map((permission) => (
                    <span
                      key={permission}
                      className="
                          inline-flex
                          items-center
                          gap-1.5
                          rounded-xl
                          bg-slate-100
                          px-2.5
                          py-1.5
                          text-[10px]
                          font-semibold
                          text-slate-600
                          dark:bg-slate-900
                          dark:text-slate-300
                        "
                    >
                      <Check className="h-3 w-3 text-emerald-500" />

                      {permission}
                    </span>
                  ))}
                </div>
              )}
            </section>

            {/* ------------------------------------------------------------ */}
            {/* Error                                                           */}
            {/* ------------------------------------------------------------ */}

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

            {/* ------------------------------------------------------------ */}
            {/* Editing Actions                                               */}
            {/* ------------------------------------------------------------ */}

            {editing && (
              <div
                className="
                  mt-7
                  flex
                  gap-2
                  border-t
                  border-slate-100
                  pt-5
                  dark:border-slate-800
                "
              >
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={updating}
                  className="
                    flex-1
                    rounded-xl
                    border
                    border-slate-200
                    px-4
                    py-2.5
                    text-xs
                    font-semibold
                    text-slate-600
                    transition
                    hover:bg-slate-50
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    dark:border-slate-800
                    dark:text-slate-300
                    dark:hover:bg-slate-900
                  "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => void handleSave()}
                  disabled={updating}
                  className="
                    flex
                    flex-1
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-sky-600
                    px-4
                    py-2.5
                    text-xs
                    font-bold
                    text-white
                    shadow-lg
                    shadow-sky-600/20
                    transition
                    hover:bg-sky-700
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {updating ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/* ========================================================================== */
/* Profile Field                                                              */
/* ========================================================================== */

interface ProfileFieldProps {
  label: string;
  value: string;
  editing?: boolean;
  onChange?: (value: string) => void;
  icon?: ReactNode;
}

function ProfileField({
  label,
  value,
  editing = false,
  onChange,
  icon,
}: ProfileFieldProps) {
  return (
    <div>
      <label
        className="
          mb-1.5
          block
          text-[10px]
          font-bold
          uppercase
          tracking-wide
          text-slate-400
        "
      >
        {label}
      </label>

      {editing ? (
        <input
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          className="
            h-10
            w-full
            rounded-xl
            border
            border-slate-200
            bg-white
            px-3
            text-xs
            font-medium
            text-slate-900
            outline-none
            transition
            focus:border-sky-400
            focus:ring-2
            focus:ring-sky-100
            dark:border-slate-800
            dark:bg-slate-900
            dark:text-white
            dark:focus:ring-sky-950
          "
        />
      ) : (
        <div
          className="
            flex
            h-10
            items-center
            gap-2
            rounded-xl
            bg-slate-50
            px-3
            text-xs
            font-medium
            text-slate-700
            dark:bg-slate-900
            dark:text-slate-300
          "
        >
          {icon && <span className="text-slate-400">{icon}</span>}

          <span className="truncate">{value || "Not provided"}</span>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* Account Row                                                                */
/* ========================================================================== */

interface AccountRowProps {
  label: string;
  value: string;
}

function AccountRow({ label, value }: AccountRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <span className="text-xs text-slate-500">{label}</span>

      <span
        className="
          max-w-[65%]
          truncate
          text-right
          text-xs
          font-semibold
          text-slate-800
          dark:text-slate-200
        "
      >
        {value}
      </span>
    </div>
  );
}

/* ========================================================================== */
/* Date Formatter                                                             */
/* ========================================================================== */

function formatDate(value?: string | null): string {
  if (!value) {
    return "Never";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
