"use client";

export default function LoadingProducts() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="
            h-64
            animate-pulse
            rounded-3xl
            bg-muted
          "
        />
      ))}
    </div>
  );
}
