"use client";

import {
  Building2,
  Crown,
  Sparkles,
  TrendingUp,
  Users,
  BarChart3,
  Hash,
} from "lucide-react";

import type { DashboardSummary } from "../types/dashboard.type";

interface ExecutiveHeroProps {
  dashboard: DashboardSummary;
}

export default function ExecutiveHero({ dashboard }: ExecutiveHeroProps) {
  const hour = new Date().getHours();

  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const userName = dashboard.owner.name?.trim() || "User";

  const isOwner = dashboard.owner.role === "OWNER";

  const roleLabel = isOwner
    ? "OWNER"
    : dashboard.owner.role
      ? dashboard.owner.role.replace(/_/g, " ")
      : "EMPLOYEE";

  return (
    <section
      className="
        relative
        overflow-hidden
        rounded-[30px]
        border
        border-slate-200/80
        bg-gradient-to-br
        from-white
        via-white
        to-sky-50
        shadow-[0_12px_40px_rgba(15,23,42,0.08)]
        dark:border-white/10
        dark:from-slate-900
        dark:via-slate-900
        dark:to-sky-950/30
      "
    >
      {/* ------------------------------------------------------------------ */}
      {/* Ambient Background                                                  */}
      {/* ------------------------------------------------------------------ */}

      <div
        className="
          pointer-events-none
          absolute
          -right-24
          -top-24
          h-64
          w-64
          rounded-full
          bg-sky-400/15
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-24
          -right-10
          h-56
          w-56
          rounded-full
          bg-violet-400/10
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -left-20
          top-1/2
          h-40
          w-40
          -translate-y-1/2
          rounded-full
          bg-blue-400/10
          blur-3xl
        "
      />

      {/* ------------------------------------------------------------------ */}
      {/* Main Content                                                        */}
      {/* ------------------------------------------------------------------ */}

      <div className="relative p-5 sm:p-6">
        {/* ---------------------------------------------------------------- */}
        {/* Greeting                                                          */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex items-center gap-2.5">
          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-sky-200
              bg-sky-50
              text-sky-600
              shadow-sm
              dark:border-sky-400/20
              dark:bg-sky-400/10
              dark:text-sky-400
            "
          >
            <Sparkles className="h-4 w-4" />
          </div>

          <span
            className="
              text-sm
              font-semibold
              text-sky-600
              dark:text-sky-400
            "
          >
            {greeting}
          </span>

          {/* Role */}

          <span
            className={`
              inline-flex
              items-center
              gap-1
              rounded-full
              border
              px-2.5
              py-1
              text-[9px]
              font-bold
              uppercase
              tracking-[0.12em]
              ${
                isOwner
                  ? `
                    border-amber-200
                    bg-amber-50
                    text-amber-700
                    dark:border-amber-400/20
                    dark:bg-amber-400/10
                    dark:text-amber-300
                  `
                  : `
                    border-slate-200
                    bg-slate-100
                    text-slate-600
                    dark:border-white/10
                    dark:bg-white/5
                    dark:text-slate-300
                  `
              }
            `}
          >
            {isOwner && <Crown className="h-3 w-3" />}

            {roleLabel}
          </span>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Welcome                                                           */}
        {/* ---------------------------------------------------------------- */}

        <div className="mt-5 max-w-full">
          <h2
            className="
              text-[27px]
              font-extrabold
              leading-[1.12]
              tracking-[-0.035em]
              text-slate-950
              dark:text-white
              sm:text-3xl
            "
          >
            Good to see you,
          </h2>

          <h3
            className="
              mt-1
              break-words
              text-[23px]
              font-extrabold
              leading-tight
              tracking-[-0.025em]
              text-sky-600
              dark:text-sky-400
              sm:text-2xl
            "
          >
            {userName}
          </h3>

          <div
            className="
              mt-4
              h-1
              w-10
              rounded-full
              bg-sky-500
            "
          />

          <p
            className="
              mt-3
              text-sm
              leading-6
              text-slate-500
              dark:text-slate-400
            "
          >
            Let&apos;s make today a productive day for your business.
          </p>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Decorative Business Illustration                                  */}
        {/* ---------------------------------------------------------------- */}

        <div
          className="
            pointer-events-none
            absolute
            right-3
            top-20
            hidden
            h-36
            w-36
            sm:block
          "
        >
          {/* Main circle */}

          <div
            className="
              absolute
              inset-0
              rounded-full
              border
              border-sky-200/70
              bg-gradient-to-br
              from-sky-100/80
              to-blue-100/40
              shadow-inner
              dark:border-sky-400/10
              dark:from-sky-500/10
              dark:to-blue-500/5
            "
          />

          {/* Business icon */}

          <div
            className="
              absolute
              left-1/2
              top-1/2
              flex
              h-16
              w-16
              -translate-x-1/2
              -translate-y-1/2
              items-center
              justify-center
              rounded-2xl
              border
              border-white
              bg-white
              text-sky-600
              shadow-[0_12px_30px_rgba(14,165,233,0.18)]
              dark:border-white/10
              dark:bg-slate-800
              dark:text-sky-400
            "
          >
            <Building2 className="h-8 w-8" />
          </div>

          {/* Chart */}

          <div
            className="
              absolute
              right-1
              top-3
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-white
              bg-white
              text-violet-600
              shadow-lg
              dark:border-white/10
              dark:bg-slate-800
              dark:text-violet-400
            "
          >
            <TrendingUp className="h-5 w-5" />
          </div>

          {/* Users */}

          <div
            className="
              absolute
              bottom-2
              right-1
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-white
              bg-white
              text-emerald-500
              shadow-lg
              dark:border-white/10
              dark:bg-slate-800
            "
          >
            <Users className="h-5 w-5" />
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Business Information                                              */}
        {/* ---------------------------------------------------------------- */}

        <div
          className="
            relative
            mt-6
            overflow-hidden
            rounded-2xl
            border
            border-slate-200/80
            bg-white/80
            shadow-sm
            backdrop-blur-xl
            dark:border-white/10
            dark:bg-white/[0.04]
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
              px-3.5
              py-3.5
            "
          >
            {/* Business Icon */}

            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-sky-100
                text-sky-600
                dark:bg-sky-500/10
                dark:text-sky-400
              "
            >
              <Building2 className="h-5 w-5" />
            </div>

            {/* Business Name */}

            <div className="min-w-0 flex-1">
              <p
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-sky-500
                  dark:text-sky-400
                "
              >
                Business
              </p>

              <p
                className="
                  mt-1
                  truncate
                  text-sm
                  font-bold
                  text-slate-900
                  dark:text-white
                "
                title={dashboard.business.name}
              >
                {dashboard.business.name}
              </p>
            </div>

            {/* Divider */}

            <div
              className="
                hidden
                h-10
                w-px
                bg-slate-200
                dark:bg-white/10
                sm:block
              "
            />

            {/* Business ID */}

            <div
              className="
                hidden
                shrink-0
                items-center
                gap-2
                rounded-xl
                bg-slate-50
                px-3
                py-2
                sm:flex
                dark:bg-white/5
              "
            >
              <Hash
                className="
                  h-3.5
                  w-3.5
                  text-violet-500
                "
              />

              <div>
                <p
                  className="
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-[0.16em]
                    text-slate-400
                  "
                >
                  Business ID
                </p>

                <p
                  className="
                    mt-0.5
                    text-[10px]
                    font-bold
                    tracking-wide
                    text-slate-700
                    dark:text-slate-200
                  "
                >
                  {dashboard.business.businessId}
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Business ID */}

          <div
            className="
              flex
              items-center
              justify-between
              border-t
              border-slate-100
              bg-slate-50/70
              px-4
              py-2
              sm:hidden
              dark:border-white/5
              dark:bg-white/[0.02]
            "
          >
            <div className="flex items-center gap-1.5">
              <Hash className="h-3 w-3 text-violet-500" />

              <span
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.15em]
                  text-slate-400
                "
              >
                Business ID
              </span>
            </div>

            <span
              className="
                text-[10px]
                font-bold
                tracking-wide
                text-slate-600
                dark:text-slate-300
              "
            >
              {dashboard.business.businessId}
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Bottom Accent                                                       */}
      {/* ------------------------------------------------------------------ */}

      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-sky-400/50
          to-transparent
        "
      />
    </section>
  );
}
