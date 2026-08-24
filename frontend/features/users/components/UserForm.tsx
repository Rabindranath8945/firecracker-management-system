"use client";

import { Check, ChevronDown, ShieldCheck, UserPlus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { USER_PERMISSIONS, USER_ROLES } from "../constants/user.constants";

import type {
  CreateEmployeeInput,
  UpdateEmployeeInput,
  User,
} from "../types/user.types";

interface UserFormProps {
  open: boolean;
  user?: User | null;
  businessId?: string;
  loading?: boolean;
  onClose: () => void;

  onCreate: (data: CreateEmployeeInput) => Promise<void>;

  onUpdate: (id: string, data: UpdateEmployeeInput) => Promise<void>;
}

const ROLE_LABELS: Record<(typeof USER_ROLES)[number], string> = {
  OWNER: "Owner",
  MANAGER: "Manager",
  CASHIER: "Cashier",
  INVENTORY: "Inventory",
  CUSTOM: "Custom",
};

const ROLE_DESCRIPTIONS: Record<(typeof USER_ROLES)[number], string> = {
  OWNER: "Full business control and administration.",
  MANAGER: "Manage daily operations and team activity.",
  CASHIER: "Handle sales, payments and customers.",
  INVENTORY: "Manage products, stock and purchases.",
  CUSTOM: "Create a custom access profile.",
};

const PERMISSION_LABELS: Record<(typeof USER_PERMISSIONS)[number], string> = {
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

function getDefaultPermissions(role: (typeof USER_ROLES)[number]) {
  if (role === "OWNER") {
    return [...USER_PERMISSIONS];
  }

  if (role === "MANAGER") {
    return [
      "DASHBOARD",
      "PRODUCTS",
      "CATEGORIES",
      "CUSTOMERS",
      "SUPPLIERS",
      "PURCHASES",
      "SALES",
      "EXPENSES",
      "REPORTS",
      "NOTIFICATIONS",
    ] as const;
  }

  if (role === "CASHIER") {
    return ["DASHBOARD", "CUSTOMERS", "SALES", "NOTIFICATIONS"] as const;
  }

  if (role === "INVENTORY") {
    return [
      "DASHBOARD",
      "PRODUCTS",
      "CATEGORIES",
      "SUPPLIERS",
      "PURCHASES",
      "OCR",
      "NOTIFICATIONS",
    ] as const;
  }

  return [];
}

export default function UserForm({
  open,
  user = null,
  businessId,
  loading = false,
  onClose,
  onCreate,
  onUpdate,
}: UserFormProps) {
  const isEditing = Boolean(user);

  const [firstName, setFirstName] = useState("");

  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");

  const [mobile, setMobile] = useState("");

  const [role, setRole] = useState<(typeof USER_ROLES)[number]>("CASHIER");

  const [permissions, setPermissions] = useState<
    (typeof USER_PERMISSIONS)[number][]
  >([]);

  const [roleOpen, setRoleOpen] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setMobile(user.mobile);
      setRole(user.role);
      setPermissions([...user.permissions]);
    } else {
      setFirstName("");
      setLastName("");
      setEmail("");
      setMobile("");
      setRole("CASHIER");
      setPermissions([...getDefaultPermissions("CASHIER")]);
    }

    setError(null);
    setRoleOpen(false);
  }, [open, user]);

  const selectedRoleDescription = ROLE_DESCRIPTIONS[role];

  const allSelected = useMemo(
    () => permissions.length === USER_PERMISSIONS.length,
    [permissions],
  );

  function handleRoleChange(nextRole: (typeof USER_ROLES)[number]) {
    setRole(nextRole);
    setRoleOpen(false);

    if (nextRole !== "CUSTOM") {
      setPermissions([...getDefaultPermissions(nextRole)]);
    } else {
      setPermissions([]);
    }
  }

  function togglePermission(permission: (typeof USER_PERMISSIONS)[number]) {
    setPermissions((current) => {
      if (current.includes(permission)) {
        return current.filter((item) => item !== permission);
      }

      return [...current, permission];
    });
  }

  function toggleAllPermissions() {
    if (allSelected) {
      setPermissions([]);
      return;
    }

    setPermissions([...USER_PERMISSIONS]);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);

    if (!firstName.trim()) {
      setError("First name is required.");
      return;
    }

    if (!lastName.trim()) {
      setError("Last name is required.");
      return;
    }

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!mobile.trim()) {
      setError("Mobile number is required.");
      return;
    }

    if (permissions.length === 0) {
      setError("Select at least one permission.");
      return;
    }

    try {
      if (user) {
        const data: UpdateEmployeeInput = {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
          role,
          permissions,
        };

        await onUpdate(user.id, data);
      } else {
        const data: CreateEmployeeInput = {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
          role,
          permissions,
          ...(businessId
            ? {
                currentBusiness: businessId,
              }
            : {}),
        };

        await onCreate(data);
      }

      onClose();
    } catch (submitError) {
      console.error("Failed to save user:", submitError);

      setError("Unable to save user. Please try again.");
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[200]
        flex
        items-end
        justify-center
        bg-slate-950/60
        p-0
        backdrop-blur-sm
        sm:items-center
        sm:p-4
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-form-title"
    >
      <div
        className="
          flex
          max-h-[94vh]
          w-full
          max-w-2xl
          flex-col
          overflow-hidden
          rounded-t-[2rem]
          bg-white
          shadow-2xl
          sm:rounded-[2rem]
        "
      >
        {/* -------------------------------------------------------------- */}
        {/* Header                                                          */}
        {/* -------------------------------------------------------------- */}

        <div
          className="
            relative
            overflow-hidden
            bg-gradient-to-br
            from-slate-950
            via-slate-900
            to-sky-950
            px-6
            py-5
            text-white
          "
        >
          <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-sky-500/20 blur-3xl" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
                {isEditing ? (
                  <ShieldCheck className="h-6 w-6 text-sky-400" />
                ) : (
                  <UserPlus className="h-6 w-6 text-sky-400" />
                )}
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-400">
                  Team Access
                </p>

                <h2 id="user-form-title" className="mt-0.5 text-xl font-bold">
                  {isEditing ? "Edit User" : "Add New User"}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-white/10
                text-slate-300
                transition
                hover:bg-white/15
                hover:text-white
              "
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* -------------------------------------------------------------- */}
        {/* Form                                                           */}
        {/* -------------------------------------------------------------- */}

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-5 sm:p-6">
            {/* Identity */}

            <section>
              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Personal Information
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Basic information for this team member.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="user-first-name"
                    className="mb-1.5 block text-xs font-semibold text-slate-600"
                  >
                    First Name
                  </label>

                  <Input
                    id="user-first-name"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    placeholder="Rabindranath"
                    className="h-11 rounded-2xl"
                  />
                </div>

                <div>
                  <label
                    htmlFor="user-last-name"
                    className="mb-1.5 block text-xs font-semibold text-slate-600"
                  >
                    Last Name
                  </label>

                  <Input
                    id="user-last-name"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    placeholder="Mondal"
                    className="h-11 rounded-2xl"
                  />
                </div>

                <div>
                  <label
                    htmlFor="user-email"
                    className="mb-1.5 block text-xs font-semibold text-slate-600"
                  >
                    Email
                  </label>

                  <Input
                    id="user-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="user@example.com"
                    className="h-11 rounded-2xl"
                  />
                </div>

                <div>
                  <label
                    htmlFor="user-mobile"
                    className="mb-1.5 block text-xs font-semibold text-slate-600"
                  >
                    Mobile
                  </label>

                  <Input
                    id="user-mobile"
                    value={mobile}
                    onChange={(event) => setMobile(event.target.value)}
                    placeholder="9876543210"
                    inputMode="tel"
                    className="h-11 rounded-2xl"
                  />
                </div>
              </div>
            </section>

            {/* Role */}

            <section>
              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Role & Access
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Define what this user can access.
                </p>
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setRoleOpen((current) => !current)}
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50
                    p-4
                    text-left
                    transition
                    hover:border-sky-300
                    hover:bg-white
                  "
                >
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {ROLE_LABELS[role]}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {selectedRoleDescription}
                    </p>
                  </div>

                  <ChevronDown
                    className={`h-5 w-5 text-slate-400 transition-transform ${
                      roleOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {roleOpen && (
                  <div
                    className="
                      absolute
                      left-0
                      right-0
                      top-full
                      z-20
                      mt-2
                      overflow-hidden
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      p-2
                      shadow-2xl
                    "
                  >
                    {USER_ROLES.map((item) => {
                      const selected = role === item;

                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => handleRoleChange(item)}
                          className={`
                              flex
                              w-full
                              items-center
                              justify-between
                              rounded-xl
                              p-3
                              text-left
                              transition
                              ${selected ? "bg-sky-50" : "hover:bg-slate-50"}
                            `}
                        >
                          <div>
                            <p
                              className={`text-sm font-semibold ${
                                selected ? "text-sky-700" : "text-slate-900"
                              }`}
                            >
                              {ROLE_LABELS[item]}
                            </p>

                            <p className="mt-0.5 text-[11px] text-slate-500">
                              {ROLE_DESCRIPTIONS[item]}
                            </p>
                          </div>

                          {selected && (
                            <Check className="h-4 w-4 text-sky-600" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>

            {/* Permissions */}

            <section>
              <div className="mb-4 flex items-end justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Permissions
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {permissions.length} of {USER_PERMISSIONS.length}{" "}
                    permissions enabled.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={toggleAllPermissions}
                  className="
                    text-xs
                    font-semibold
                    text-sky-600
                    transition
                    hover:text-sky-700
                  "
                >
                  {allSelected ? "Clear all" : "Select all"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {USER_PERMISSIONS.map((permission) => {
                  const selected = permissions.includes(permission);

                  return (
                    <button
                      key={permission}
                      type="button"
                      onClick={() => togglePermission(permission)}
                      className={`
                          flex
                          items-center
                          gap-2
                          rounded-2xl
                          border
                          p-3
                          text-left
                          transition-all
                          duration-200
                          ${
                            selected
                              ? "border-sky-200 bg-sky-50 text-sky-700"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                          }
                        `}
                    >
                      <span
                        className={`
                            flex
                            h-5
                            w-5
                            shrink-0
                            items-center
                            justify-center
                            rounded-md
                            border
                            transition
                            ${
                              selected
                                ? "border-sky-600 bg-sky-600 text-white"
                                : "border-slate-300 bg-white"
                            }
                          `}
                      >
                        {selected && <Check className="h-3.5 w-3.5" />}
                      </span>

                      <span className="truncate text-xs font-semibold">
                        {PERMISSION_LABELS[permission]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Error */}

            {error && (
              <div
                className="
                  rounded-2xl
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  font-medium
                  text-red-600
                "
              >
                {error}
              </div>
            )}
          </div>

          {/* ------------------------------------------------------------ */}
          {/* Footer                                                        */}
          {/* ------------------------------------------------------------ */}

          <div
            className="
              flex
              items-center
              justify-end
              gap-3
              border-t
              border-slate-100
              bg-white
              px-5
              py-4
              sm:px-6
            "
          >
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="rounded-2xl px-5"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="
                min-w-32
                rounded-2xl
                bg-slate-950
                px-5
                text-white
                shadow-lg
                shadow-slate-950/10
                transition-all
                hover:bg-slate-800
              "
            >
              {loading
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Create User"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
