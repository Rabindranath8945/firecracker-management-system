"use client";

import Image from "next/image";
import { Camera } from "lucide-react";
import { useRef, useState } from "react";

export default function ProductImagePicker() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string>();

  function handleSelect(file: File | null) {
    if (!file) return;

    const url = URL.createObjectURL(file);

    setPreview(url);
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        hidden
        accept="image/*"
        onChange={(e) => handleSelect(e.target.files?.[0] ?? null)}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="
group
relative
h-36
w-36
overflow-hidden
rounded-3xl
border-2
border-dashed
border-primary/30
bg-slate-100
transition
hover:scale-105
"
      >
        {preview ? (
          <Image
            src={preview}
            alt=""
            fill
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <Camera className="h-10 w-10 text-primary" />

            <span className="text-xs text-muted-foreground">Upload</span>
          </div>
        )}
      </button>
    </>
  );
}
