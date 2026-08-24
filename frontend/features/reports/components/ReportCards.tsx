"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { REPORT_CARDS } from "../constants/report.constants";

export default function ReportCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {REPORT_CARDS.map((report) => {
        const Icon = report.icon;

        return (
          <Link
            key={report.id}
            href={report.href}
            className="group block outline-none"
          >
            <Card className="h-full overflow-hidden border-border/60 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-primary">
              <CardContent className="flex h-full flex-col p-5">
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/60 transition-all group-hover:bg-primary/10">
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                </div>

                <div className="mt-5 flex-1">
                  <h3 className="font-semibold tracking-tight">
                    {report.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {report.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t pt-4">
                  <span className="text-sm font-semibold text-primary">
                    Open Report
                  </span>

                  <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
