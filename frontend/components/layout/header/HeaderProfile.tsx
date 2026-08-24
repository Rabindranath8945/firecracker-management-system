"use client";

import {
  ChevronDown,
  Clock3,
  KeyRound,
  LogOut,
  Settings,
  Shield,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import authService from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/features/auth/store/auth.store";

import ProfileAvatar from "@/features/users/components/ProfileAvatar";
import ProfileDialog from "@/features/users/components/ProfileDialog";
import SecurityDialog from "@/features/users/components/SecurityDialog";
import { useProfile } from "@/features/users/hooks/useProfile";
import ProfileBusinessCard from "@/features/users/components/ProfileBusinessCard";
import useCurrentBusiness from "@/features/business/hooks/useCurrentBusiness";

export default function HeaderProfile() {
  const router = useRouter();

  const logoutStore = useAuthStore((state) => state.logout);

  const { profile, loading } = useProfile();

  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const { business: currentBusiness, loading: businessLoading } =
    useCurrentBusiness();

  if (loading) {
    return (
      <div
        className="
          h-10
          w-10
          animate-pulse
          rounded-full
          bg-white/10
        "
      />
    );
  }

  if (!profile) {
    return null;
  }

  /* ---------------------------------------------------------------------- */
  /* Profile data                                                            */
  /* ---------------------------------------------------------------------- */

  const firstName = profile.firstName?.trim() ?? "";

  const lastName = profile.lastName?.trim() ?? "";

  const email = profile.email?.trim() ?? "";

  const fullName =
    `${firstName} ${lastName}`.trim() || email.split("@")[0] || "User";

  const role = profile.role
    ? profile.role.charAt(0) + profile.role.slice(1).toLowerCase()
    : "User";

  const isActive = profile.isActive === true;

  const permissionLabel =
    profile.role === "OWNER"
      ? "Full Access"
      : profile.permissions?.length
        ? `${profile.permissions.length} Modules`
        : "No Permissions";

  /* ---------------------------------------------------------------------- */
  /* Actions                                                                 */
  /* ---------------------------------------------------------------------- */

  function handleProfileOpen() {
    setOpen(false);
    setProfileOpen(true);
  }

  function handleSecurityOpen() {
    setOpen(false);
    setSecurityOpen(true);
  }

  function handleSettingsOpen() {
    setOpen(false);
    router.push("/settings");
  }

  async function handleSignOut() {
    try {
      setOpen(false);

      await authService.logout();
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      logoutStore();

      router.replace("/login");
    }
  }

  return (
    <>
      <div ref={containerRef} className="relative">
        {/* ================================================================= */}
        {/* Profile Trigger                                                    */}
        {/* ================================================================= */}

        <button
          type="button"
          aria-label="Open account menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="
            group
            flex
            items-center
            gap-2
            rounded-2xl
            p-1
            transition-all
            duration-200
            hover:bg-white/10
            active:scale-95
          "
        >
          <div className="relative">
            <ProfileAvatar
              src={profile.profilePicture}
              name={fullName}
              size="md"
            />

            {/* Online indicator */}

            <span
              className="
                absolute
                bottom-0
                right-0
                h-2.5
                w-2.5
                rounded-full
                border-2
                border-slate-950
                bg-emerald-400
              "
            />
          </div>

          <ChevronDown
            className={`
              hidden
              h-3.5
              w-3.5
              text-slate-400
              transition-transform
              duration-200
              sm:block
              ${open ? "rotate-180" : ""}
            `}
          />
        </button>

        {/* ================================================================= */}
        {/* Account Dropdown                                                   */}
        {/* ================================================================= */}

        {open && (
          <div
            className="
              absolute
              right-0
              top-[calc(100%+10px)]
              z-[200]
              w-[350px]
              max-w-[calc(100vw-24px)]
              overflow-hidden
              rounded-[1.5rem]
              border
              border-slate-200
              bg-white
              shadow-2xl
              shadow-slate-950/20
              dark:border-slate-800
              dark:bg-slate-950
            "
          >
            {/* ============================================================= */}
            {/* Identity                                                       */}
            {/* ============================================================= */}

            <div
              className="
                bg-gradient-to-br
                from-slate-950
                via-slate-900
                to-sky-950
                px-5
                py-5
                text-white
              "
            >
              <div className="flex items-start gap-3">
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
        h-2.5
        w-2.5
        rounded-full
        border-2
        border-slate-950
        bg-emerald-400
      "
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-bold text-white">
                        {fullName}
                      </h3>

                      <p className="mt-0.5 truncate text-[11px] text-slate-400">
                        {profile.email || "No email available"}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-sky-400/15 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-sky-300">
                      {role}
                    </span>
                  </div>

                  {/* ONLY BUSINESS CARD */}
                  <ProfileBusinessCard
                    businessName={
                      businessLoading
                        ? "Loading business..."
                        : (currentBusiness?.name ?? "No Business Selected")
                    }
                    businessCode={currentBusiness?.businessId ?? null}
                  />
                </div>
              </div>
            </div>

            {/* ============================================================= */}
            {/* Account Overview                                                */}
            {/* ============================================================= */}

            <div className="border-b border-slate-100 p-4 dark:border-slate-800">
              <div className="grid grid-cols-2 gap-2">
                <AccountInfo
                  icon={<Shield className="h-4 w-4" />}
                  label="Access"
                  value={permissionLabel}
                  iconClass="bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400"
                />

                <AccountInfo
                  icon={<KeyRound className="h-4 w-4" />}
                  label="App Lock"
                  value={profile.appLockEnabled ? "Enabled" : "Disabled"}
                  iconClass={
                    profile.appLockEnabled
                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400"
                  }
                />

                <AccountInfo
                  icon={<Shield className="h-4 w-4" />}
                  label="Status"
                  value={isActive ? "Active" : "Inactive"}
                  iconClass={
                    isActive
                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                      : "bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400"
                  }
                />

                <AccountInfo
                  icon={<Clock3 className="h-4 w-4" />}
                  label="Last Login"
                  value={formatDate(profile.lastLogin)}
                  iconClass="bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400"
                />
              </div>
            </div>

            {/* ============================================================= */}
            {/* Actions                                                         */}
            {/* ============================================================= */}

            <div className="p-2">
              <ProfileMenuButton
                icon={<UserRound className="h-4 w-4" />}
                title="My Profile"
                description="Personal information"
                onClick={handleProfileOpen}
              />

              <ProfileMenuButton
                icon={<Shield className="h-4 w-4" />}
                title="Security"
                description="Account protection & app lock"
                onClick={handleSecurityOpen}
              />

              <ProfileMenuButton
                icon={<Settings className="h-4 w-4" />}
                title="Account Settings"
                description="ERP preferences & configuration"
                onClick={handleSettingsOpen}
              />
            </div>

            {/* ============================================================= */}
            {/* Activity                                                        */}
            {/* ============================================================= */}

            <div
              className="
                mx-3
                mb-3
                rounded-xl
                bg-slate-50
                px-3
                py-2.5
                dark:bg-slate-900
              "
            >
              <div className="flex items-center gap-2">
                <Clock3 className="h-3.5 w-3.5 text-slate-400" />

                <div className="min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                    Last Login
                  </p>

                  <p className="truncate text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                    {formatDate(profile.lastLogin)}
                  </p>
                </div>

                <div className="ml-auto flex items-center gap-1.5">
                  <span
                    className={`
                      h-1.5
                      w-1.5
                      rounded-full
                      ${isActive ? "bg-emerald-500" : "bg-slate-400"}
                    `}
                  />

                  <span className="text-[9px] font-semibold text-slate-500">
                    {isActive ? "Account Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            {/* ============================================================= */}
            {/* Sign Out                                                        */}
            {/* ============================================================= */}

            <div
              className="
                border-t
                border-slate-100
                p-2
                dark:border-slate-800
              "
            >
              <button
                type="button"
                onClick={() => void handleSignOut()}
                className="
    flex
    w-full
    items-center
    gap-3
    rounded-xl
    px-3
    py-2.5
    text-sm
    font-semibold
    text-red-600
    transition
    hover:bg-red-50
    dark:hover:bg-red-950/30
  "
              >
                <LogOut className="h-4 w-4" />

                <span>Sign out</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* My Profile                                                          */}
      {/* =================================================================== */}

      <ProfileDialog open={profileOpen} onClose={() => setProfileOpen(false)} />

      {/* =================================================================== */}
      {/* Security                                                            */}
      {/* =================================================================== */}

      <SecurityDialog
        open={securityOpen}
        onClose={() => setSecurityOpen(false)}
      />
    </>
  );
}

/* ========================================================================== */
/* Account Information Card                                                   */
/* ========================================================================== */

interface AccountInfoProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  iconClass: string;
}

function AccountInfo({ icon, label, value, iconClass }: AccountInfoProps) {
  return (
    <div
      className="
        flex
        min-w-0
        items-center
        gap-2.5
        rounded-xl
        border
        border-slate-100
        bg-slate-50
        px-2.5
        py-2.5
        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      <div
        className={`
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-lg
          ${iconClass}
        `}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[9px] font-medium uppercase tracking-wider text-slate-400">
          {label}
        </p>

        <p className="truncate text-[11px] font-bold text-slate-700 dark:text-slate-200">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* Menu Button                                                                */
/* ========================================================================== */

interface ProfileMenuButtonProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

function ProfileMenuButton({
  icon,
  title,
  description,
  onClick,
}: ProfileMenuButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        flex
        w-full
        items-center
        gap-3
        rounded-xl
        px-3
        py-2.5
        text-left
        transition
        hover:bg-slate-50
        dark:hover:bg-slate-900
      "
    >
      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-slate-100
          text-slate-600
          transition
          group-hover:bg-sky-50
          group-hover:text-sky-600
          dark:bg-slate-900
          dark:text-slate-400
          dark:group-hover:bg-sky-950/40
          dark:group-hover:text-sky-400
        "
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
          {title}
        </p>

        <p className="mt-0.5 truncate text-[10px] text-slate-400">
          {description}
        </p>
      </div>

      <ChevronDown
        className="
          h-3.5
          w-3.5
          -rotate-90
          text-slate-300
          transition
          group-hover:text-slate-500
        "
      />
    </button>
  );
}

/* ========================================================================== */
/* Date                                                                       */
/* ========================================================================== */

function formatDate(value?: string | null): string {
  if (!value) {
    return "No login recorded";
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
