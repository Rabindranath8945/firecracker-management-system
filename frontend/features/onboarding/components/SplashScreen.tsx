"use client";

import Image from "next/image";
import { Loader2 } from "lucide-react";

import { useBootstrap } from "../hooks/useBootstrap";

export default function SplashScreen() {
  useBootstrap();

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white">
      {/* Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Top Right */}
        <div className="absolute -right-28 -top-20 h-72 w-72 rounded-[80px] bg-sky-100 opacity-70 blur-sm rotate-12" />

        {/* Bottom Left */}
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-[80px] bg-sky-100 opacity-70 blur-sm -rotate-12" />

        {/* Hexagon Top Left */}
        <div className="absolute left-4 top-40 h-20 w-20 rotate-12 border border-sky-200 opacity-70 [clip-path:polygon(25%_6.7%,75%_6.7%,100%_50%,75%_93.3%,25%_93.3%,0%_50%)]" />

        {/* Hexagon Bottom Right */}
        <div className="absolute bottom-40 right-4 h-20 w-20 rotate-12 border border-sky-200 opacity-70 [clip-path:polygon(25%_6.7%,75%_6.7%,100%_50%,75%_93.3%,25%_93.3%,0%_50%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <Image
          src="/onehub.png"
          alt="OneHub"
          width={185}
          height={185}
          priority
          className="h-auto w-auto"
        />

        {/* Loader */}
        <div className="mt-24 flex flex-col items-center">
          <Loader2 className="h-14 w-14 animate-spin text-sky-500" />

          <p className="mt-5 text-sm font-medium text-slate-500">
            Preparing your workspace...
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-10 flex flex-col items-center">
        <p className="text-base text-slate-500">Version 1.0.0</p>

        <div className="mt-3 flex items-center gap-1 text-base">
          <span className="text-slate-500">Built with</span>

          <span className="text-red-500">❤️</span>

          <span className="text-slate-500">by</span>

          <span className="font-semibold text-sky-600">
            Mahendra Tech Solutions
          </span>
        </div>
      </footer>
    </main>
  );
}
