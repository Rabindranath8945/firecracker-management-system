"use client";

import { MoreVertical, ShieldCheck, UserCheck, UserX } from "lucide-react";

import type { User } from "../types/user.types";

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onToggleStatus: (user: User) => void;
}

const ROLE_LABELS: Record<User["role"], string> = {
  OWNER: "Owner",
  MANAGER: "Manager",
  CASHIER: "Cashier",
  INVENTORY: "Inventory",
  CUSTOM: "Custom",
};

const ROLE_COLORS: Record<User["role"], string> = {
  OWNER: "bg-slate-100 text-slate-700",
  MANAGER: "bg-violet-100 text-violet-700",
  CASHIER: "bg-emerald-100 text-emerald-700",
  INVENTORY: "bg-amber-100 text-amber-700",
  CUSTOM: "bg-sky-100 text-sky-700",
};

export default function UserCard({
  user,
  onEdit,
  onToggleStatus,
}: UserCardProps) {
  const fullName = `${user.firstName} ${user.lastName}`.trim();

  const initials =
    fullName
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <div
      className="
        group
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-sky-200
        hover:shadow-xl
      "
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={fullName}
              className="
                h-12
                w-12
                rounded-2xl
                object-cover
              "
            />
          ) : (
            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-gradient-to-br
                from-sky-500
                to-blue-600
                text-sm
                font-bold
                text-white
              "
            >
              {initials}
            </div>
          )}

          <div className="min-w-0">
            <h3 className="truncate font-bold text-slate-900">{fullName}</h3>

            <p className="truncate text-xs text-slate-500">{user.email}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onEdit(user)}
          className="
            rounded-xl
            p-2
            text-slate-400
            transition
            hover:bg-slate-100
            hover:text-slate-700
          "
          aria-label="User options"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${ROLE_COLORS[user.role]}`}
        >
          {ROLE_LABELS[user.role]}
        </span>

        <button
          type="button"
          onClick={() => onToggleStatus(user)}
          className="
            flex
            items-center
            gap-1.5
            rounded-full
            px-3
            py-1
            text-xs
            font-semibold
            transition
          "
        >
          {user.isActive ? (
            <>
              <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-emerald-600">Active</span>
            </>
          ) : (
            <>
              <UserX className="h-3.5 w-3.5 text-red-500" />
              <span className="text-red-500">Inactive</span>
            </>
          )}
        </button>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Permissions</span>

          <span className="flex items-center gap-1 font-semibold text-slate-600">
            <ShieldCheck className="h-3.5 w-3.5" />
            {user.permissions.length}
          </span>
        </div>
      </div>
    </div>
  );
}
