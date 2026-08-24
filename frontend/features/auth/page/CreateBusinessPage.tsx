"use client";

import Image from "next/image";
import { ArrowLeft, Building2, ShieldCheck, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";

import { GoogleSignInButton } from "../components/GoogleSignInButton";

export default function CreateBusinessPage() {
  const router = useRouter();

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-white">
      {/* -------------------------------------------------------------------------- */}
      {/* Background */}
      {/* -------------------------------------------------------------------------- */}

      <div className="absolute inset-0 overflow-hidden">
        {/* Top Right */}
        <div className="absolute -right-28 -top-20 h-72 w-72 rotate-12 rounded-[80px] bg-sky-100/70 blur-sm" />

        {/* Bottom Left */}
        <div className="absolute -bottom-24 -left-24 h-72 w-72 -rotate-12 rounded-[80px] bg-sky-100/70 blur-sm" />

        {/* Hexagon */}
        <div className="absolute left-5 top-40 h-20 w-20 rotate-12 border border-sky-200 opacity-60 [clip-path:polygon(25%_6.7%,75%_6.7%,100%_50%,75%_93.3%,25%_93.3%,0%_50%)]" />

        {/* Hexagon */}
        <div className="absolute bottom-40 right-5 h-20 w-20 rotate-12 border border-sky-200 opacity-60 [clip-path:polygon(25%_6.7%,75%_6.7%,100%_50%,75%_93.3%,25%_93.3%,0%_50%)]" />
      </div>

      {/* Back */}

      <button
        onClick={() => router.back()}
        className="relative z-10 ml-6 mt-8 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/80 backdrop-blur"
      >
        <ArrowLeft className="h-5 w-5 text-slate-700" />
      </button>

      {/* Content */}

      <div className="relative z-10 flex flex-1 flex-col px-8">
        {/* Logo */}

        <div className="mt-4 flex flex-col items-center">
          <Image
            src="/onehub.png"
            alt="OneHub"
            width={185}
            height={185}
            priority
          />

          <h1 className="mt-8 text-center text-4xl font-bold tracking-tight text-slate-900">
            Create your Business
          </h1>

          <p className="mt-3 max-w-sm text-center text-base leading-7 text-slate-500">
            Create your secure OneHub workspace and manage your business from
            anywhere.
          </p>
        </div>

        {/* Features */}

        <div className="mt-12 space-y-5 rounded-3xl border border-sky-100 bg-sky-50/40 p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-sky-100 p-3">
              <Building2 className="h-6 w-6 text-sky-600" />
            </div>

            <div>
              <h3 className="font-semibold text-slate-900">
                Your own workspace
              </h3>

              <p className="text-sm text-slate-500">
                Manage inventory, sales and reports.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-sky-100 p-3">
              <ShieldCheck className="h-6 w-6 text-sky-600" />
            </div>

            <div>
              <h3 className="font-semibold text-slate-900">
                Secure Google Login
              </h3>

              <p className="text-sm text-slate-500">
                Protected authentication for your business.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-sky-100 p-3">
              <Smartphone className="h-6 w-6 text-sky-600" />
            </div>

            <div>
              <h3 className="font-semibold text-slate-900">Mobile First</h3>

              <p className="text-sm text-slate-500">
                Fast, offline-ready and works on every device.
              </p>
            </div>
          </div>
        </div>

        {/* Google */}

        <div className="mt-10">
          <p className="mb-4 text-center text-sm text-slate-500">
            Continue securely with Google
          </p>

          <GoogleSignInButton flow="create" />
        </div>

        <div className="flex-1" />

        {/* Footer */}

        <footer className="pb-8 text-center">
          <p className="text-sm text-slate-500">Version 1.0.0</p>

          <div className="mt-2 flex items-center justify-center gap-1 text-sm">
            <span className="text-slate-500">Built with</span>

            <span className="text-red-500">❤️</span>

            <span className="text-slate-500">by</span>

            <span className="font-semibold text-sky-600">
              Mahendra Tech Solutions
            </span>
          </div>
        </footer>
      </div>
    </main>
  );
}
