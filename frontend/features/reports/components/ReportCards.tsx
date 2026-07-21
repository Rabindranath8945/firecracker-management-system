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
          <Link key={report.id} href={report.href} className="group">
            <Card className="h-full border-border/60 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
              <CardContent className="flex h-full flex-col p-5">
                {/* Header */}
                <div className="mb-5 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon />
                  </div>

                  <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  <h3 className="text-base font-semibold">{report.title}</h3>

                  <p className="text-sm leading-6 text-muted-foreground">
                    {report.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="mt-6 flex items-center justify-between border-t pt-4">
                  <span className="text-sm font-medium text-primary">
                    Open Report
                  </span>

                  <ArrowRight className="h-4 w-4 text-primary transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
