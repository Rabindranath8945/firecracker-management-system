"use client";

import {
  Check,
  ChevronDown,
  Loader2,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import {
  USER_PERMISSIONS,
  USER_ROLES,
  type UserPermission,
  type UserRole,
} from "../constants/user.constants";

import type { CreateInvitationInput } from "../types/invitation.types";

interface InviteUserDialogProps {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  loading?: boolean;

  onCreate: (input: CreateInvitationInput) => Promise<{
    id: string;
    token: string;
    role: UserRole;
    permissions: UserPermission[];
    expiresAt: string;
  }>;
}

const ROLE_LABELS: Record<UserRole, string> = {
  OWNER: "Owner",
  MANAGER: "Manager",
  CASHIER: "Cashier",
  INVENTORY: "Inventory",
  CUSTOM: "Custom",
};

const PERMISSION_LABELS: Record<UserPermission, string> = {
  DASHBOARD: "Dashboard",
  PRODUCTS: "Products",
  CATEGORIES: "Categories",
  CUSTOMERS: "Customers",
  SUPPLIERS: "Suppliers",
  PURCHASES: "Purchases",
  SALES: "Sales",
  EXPENSES: "Expenses",
  REPORTS: "Reports",
  SETTINGS: "Settings",
  BACKUP: "Backup",
  SECURITY: "Security",
  NOTIFICATIONS: "Notifications",
  OCR: "OCR",
  USERS: "Users",
};

export default function InviteUserDialog({
  open,
  onOpenChange,
  loading = false,
  onCreate,
}: InviteUserDialogProps) {
  const [role, setRole] = useState<UserRole>("CASHIER");

  const [permissions, setPermissions] = useState<UserPermission[]>([
    "DASHBOARD",
    "SALES",
  ]);

  const [roleOpen, setRoleOpen] = useState(false);

  const availablePermissions = useMemo(
    () =>
      USER_PERMISSIONS.filter(
        (permission) =>
          permission !== "USERS" || role === "OWNER" || role === "MANAGER",
      ),
    [role],
  );

  if (!open) {
    return null;
  }

  function togglePermission(permission: UserPermission) {
    setPermissions((current) =>
      current.includes(permission)
        ? current.filter((item) => item !== permission)
        : [...current, permission],
    );
  }

  async function handleCreate() {
    const result = await onCreate({
      role,
      permissions,
    });

    if (result.token) {
      onOpenChange(false);

      window.dispatchEvent(
        new CustomEvent("erp:invitation-created", {
          detail: result,
        }),
      );
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md">
      <div className="w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-2xl dark:bg-slate-950">
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-6 py-7 text-white">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-sky-400/20 blur-3xl" />

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-slate-300 transition hover:bg-white/20 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400/15 ring-1 ring-sky-300/20">
              <Users className="h-6 w-6 text-sky-300" />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-300">
                Team Access
              </p>

              <h2 className="mt-1 text-xl font-bold">Invite User</h2>

              <p className="mt-1 text-xs text-slate-400">
                Create secure access for your team.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-6">
          {/* Role */}

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
              Role
            </label>

            <div className="relative">
              <button
                type="button"
                onClick={() => setRoleOpen((value) => !value)}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold dark:border-slate-800 dark:bg-slate-900"
              >
                <span>{ROLE_LABELS[role]}</span>

                <ChevronDown className="h-4 w-4" />
              </button>

              {roleOpen && (
                <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                  {USER_ROLES.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setRole(item);
                        setRoleOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      {ROLE_LABELS[item]}

                      {role === item && (
                        <Check className="h-4 w-4 text-sky-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Permissions */}

          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Permissions
              </label>

              <span className="text-[10px] font-semibold text-sky-600">
                {permissions.length} selected
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {availablePermissions.map((permission) => {
                const selected = permissions.includes(permission);

                return (
                  <button
                    key={permission}
                    type="button"
                    onClick={() => togglePermission(permission)}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-semibold transition ${
                      selected
                        ? "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-500/10 dark:text-sky-300"
                        : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950"
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-md border ${
                        selected
                          ? "border-sky-500 bg-sky-500 text-white"
                          : "border-slate-300"
                      }`}
                    >
                      {selected && <Check className="h-3 w-3" />}
                    </span>

                    {PERMISSION_LABELS[permission]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Security Info */}

          <div className="flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 dark:border-emerald-900/40 dark:bg-emerald-500/5">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />

            <div>
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                Secure invitation
              </p>

              <p className="mt-1 text-[11px] leading-5 text-emerald-700/70 dark:text-emerald-400/70">
                The employee will join only after you approve their request.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={loading || permissions.length === 0}
            onClick={() => void handleCreate()}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-950"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}

            {loading ? "Generating..." : "Generate Invitation"}
          </button>
        </div>
      </div>
    </div>
  );
}
