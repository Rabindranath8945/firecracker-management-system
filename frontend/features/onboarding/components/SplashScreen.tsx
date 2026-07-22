"use client";

import Image from "next/image";
import { Loader2 } from "lucide-react";

import { useBootstrap } from "../hooks/useBootstrap";

export default function SplashScreen() {
  useBootstrap();

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="flex flex-col items-center">
        {/* Logo */}
        <Image
          src="/logo.png"
          alt="OneHub"
          width={170}
          height={170}
          priority
          className="h-40 w-40 object-contain drop-shadow-xl"
        />

        {/* Tagline */}
        <p className="mt-5 text-center text-lg font-medium text-muted-foreground">
          One Place. Every Business.
        </p>

        {/* Loader */}
        <div className="mt-14 flex flex-col items-center gap-4">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />

          <p className="text-sm text-muted-foreground">
            Loading your workspace...
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-8 flex flex-col items-center gap-1 text-center">
        <p className="text-xs text-muted-foreground">Version 1.0.0</p>

        <p className="text-xs text-muted-foreground">
          Built by{" "}
          <span className="font-medium text-foreground">
            Mahendra Tech Solutions
          </span>
        </p>
      </footer>
    </main>
  );
}
