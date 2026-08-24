"use client";

import Image from "next/image";

import { UserRound } from "lucide-react";

interface ProfileAvatarProps {
  src?: string | null;

  name?: string;

  size?: "sm" | "md" | "lg";
}

const SIZE_CLASSES = {
  sm: "h-9 w-9",

  md: "h-11 w-11",

  lg: "h-20 w-20",
} as const;

export default function ProfileAvatar({
  src,
  name,
  size = "md",
}: ProfileAvatarProps) {
  const initials =
    name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase() || "";

  return (
    <div
      className={`
        ${SIZE_CLASSES[size]}
        relative
        shrink-0
        overflow-hidden
        rounded-full
        border
        border-white/20
        bg-slate-900
        shadow-lg
      `}
    >
      {src ? (
        <Image
          src={src}
          alt={name || "Profile"}
          fill
          sizes="80px"
          className="object-cover"
        />
      ) : initials ? (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-500 to-blue-600 text-xs font-bold text-white">
          {initials}
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <UserRound className="h-1/2 w-1/2 text-slate-400" />
        </div>
      )}
    </div>
  );
}
