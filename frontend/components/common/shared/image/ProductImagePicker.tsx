"use client";

import { Camera } from "lucide-react";

export default function ProductImagePicker() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Camera className="h-8 w-8 text-slate-600" />
      <span className="text-sm text-slate-500">
        Product Photo Coming Soon ...
      </span>
    </div>
  );
}
