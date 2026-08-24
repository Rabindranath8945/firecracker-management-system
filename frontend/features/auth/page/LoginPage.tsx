"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, Users } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-white">
      {/* -------------------------------------------------------------------------- */}
      {/* Background */}
      {/* -------------------------------------------------------------------------- */}

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-28 -top-20 h-72 w-72 rotate-12 rounded-[80px] bg-sky-100/70 blur-sm" />

        <div className="absolute -bottom-24 -left-24 h-72 w-72 -rotate-12 rounded-[80px] bg-sky-100/70 blur-sm" />

        <div className="absolute left-5 top-40 h-20 w-20 rotate-12 border border-sky-200 opacity-60 [clip-path:polygon(25%_6.7%,75%_6.7%,100%_50%,75%_93.3%,25%_93.3%,0%_50%)]" />

        <div className="absolute bottom-40 right-4 h-20 w-20 rotate-12 border border-sky-200 opacity-60 [clip-path:polygon(25%_6.7%,75%_6.7%,100%_50%,75%_93.3%,25%_93.3%,0%_50%)]" />
      </div>

      {/* -------------------------------------------------------------------------- */}
      {/* Content */}
      {/* -------------------------------------------------------------------------- */}

      <div className="relative z-10 flex flex-1 flex-col px-7 pt-14">
        {/* Logo */}

        <div className="flex flex-col items-center">
          <Image
            src="/onehub.png"
            alt="OneHub"
            width={185}
            height={185}
            priority
            className="h-auto w-auto"
          />

          <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
            Welcome to OneHub
          </h1>

          <p className="mt-3 text-center text-base text-slate-500">
            Choose how you'd like to continue.
          </p>
        </div>

        {/* Actions */}

        <div className="mt-14 space-y-5">
          {/* Create Business */}

          <Link
            href="/create-business"
            className="block rounded-3xl border-2 border-sky-500 bg-sky-500 p-6 transition-all duration-200 hover:bg-sky-600"
          >
            <div className="flex items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                <Building2 className="h-7 w-7 text-white" />
              </div>

              <div className="ml-5 flex-1">
                <h2 className="text-lg font-semibold text-white">
                  Create a Business
                </h2>

                <p className="mt-1 text-sm text-sky-100">
                  Become the owner of a new workspace
                </p>
              </div>

              <ArrowRight className="h-6 w-6 text-white" />
            </div>
          </Link>

          {/* Join Business */}

          <Link
            href="/join-business"
            className="block rounded-3xl border-2 border-sky-200 bg-white p-6 transition-all duration-200 hover:border-sky-400 hover:bg-sky-50"
          >
            <div className="flex items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100">
                <Users className="h-7 w-7 text-sky-600" />
              </div>

              <div className="ml-5 flex-1">
                <h2 className="text-lg font-semibold text-slate-900">
                  Join a Business
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Employee • Staff • Manager
                </p>
              </div>

              <ArrowRight className="h-6 w-6 text-slate-400" />
            </div>
          </Link>
        </div>

        {/* Bottom Text */}

        <div className="mt-10 px-3">
          <p className="text-center text-sm leading-6 text-slate-500">
            Secure Google authentication protects your account and lets you
            safely create or join a business.
          </p>
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
