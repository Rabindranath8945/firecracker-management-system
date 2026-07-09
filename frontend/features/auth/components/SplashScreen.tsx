"use client";

import { Loader2 } from "lucide-react";
import { useBootstrap } from "../hooks/useBootstrap";

export function SplashScreen() {
  useBootstrap();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold">🔥 Firecracker</h1>

          <p className="text-muted-foreground">Management System</p>
        </div>

        <Loader2 className="h-8 w-8 animate-spin text-primary" />

        <p className="text-sm text-muted-foreground">Initializing...</p>
      </div>
    </main>
  );
}
