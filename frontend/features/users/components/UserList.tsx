"use client";

import UserCard from "./UserCard";

import type { User } from "../types/user.types";

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onToggleStatus: (user: User) => void;
}

export default function UserList({
  users,
  onEdit,
  onToggleStatus,
}: UserListProps) {
  if (users.length === 0) {
    return (
      <div
        className="
          flex
          min-h-64
          items-center
          justify-center
          rounded-3xl
          border
          border-dashed
          border-slate-300
          bg-white
          text-center
        "
      >
        <div>
          <div className="text-4xl">👥</div>

          <h3 className="mt-3 font-semibold text-slate-900">No users found</h3>

          <p className="mt-1 text-sm text-slate-500">
            Add your first team member to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          onEdit={onEdit}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </section>
  );
}
