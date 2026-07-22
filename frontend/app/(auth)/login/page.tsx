"use client";

import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";

import { GoogleSignInButton } from "@/features/auth/components/GoogleSignInButton";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-10">
      <Card className="w-full max-w-md rounded-3xl border shadow-2xl">
        <CardContent className="flex flex-col items-center p-10">
          {/* Logo */}
          <Image
            src="/logo.png"
            alt="OneHub"
            width={140}
            height={140}
            priority
            className="mb-6 h-32 w-32 object-contain"
          />

          {/* Heading */}
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome to OneHub
          </h1>

          <p className="mt-2 text-center text-muted-foreground">
            One Place. Every Business.
          </p>

          {/* Description */}
          <div className="mt-8 space-y-2 text-center">
            <p className="font-medium">Smart • Secure • Offline First</p>

            <p className="text-sm leading-6 text-muted-foreground">
              Manage inventory, sales, purchases, customers, suppliers and
              reports from anywhere.
            </p>
          </div>

          {/* Google Login */}
          <div className="mt-10 w-full">
            <GoogleSignInButton />
          </div>

          {/* Terms */}
          <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
            By continuing, you agree to OneHub's Terms of Service and Privacy
            Policy.
          </p>

          {/* Footer */}
          <div className="mt-10 flex flex-col items-center gap-1 text-center">
            <p className="text-xs text-muted-foreground">Version 1.0.0</p>

            <p className="text-xs text-muted-foreground">
              Built by{" "}
              <span className="font-medium text-foreground">
                ❤️ Mahendra Tech Solutions
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
