"use client";

import { GoogleSignInButton } from "@/features/auth/components/GoogleSignInButton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md rounded-3xl shadow-xl border-0">
        <CardContent className="space-y-8 p-10">
          <div className="space-y-3 text-center">
            <div className="text-6xl">🔥</div>

            <h1 className="text-3xl font-bold tracking-tight">Firecracker</h1>

            <p className="text-lg text-muted-foreground">Management System</p>
          </div>

          <div className="space-y-2 text-center">
            <p className="text-base font-medium">
              Smart • Secure • Offline First
            </p>

            <p className="text-sm text-muted-foreground leading-6">
              Manage inventory, sales, purchases, reports and stock from
              anywhere.
            </p>
          </div>

          <GoogleSignInButton />

          <p className="text-center text-xs text-muted-foreground">
            Version 1.0.0
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
