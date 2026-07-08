import { ReactNode } from "react";
import AppCard from "@/components/layout/AppCard";

interface DashboardWidgetProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}

export default function DashboardWidget({
  title,
  subtitle,
  action,
  children,
}: DashboardWidgetProps) {
  return (
    <AppCard className="p-5">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>

          {subtitle && (
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          )}
        </div>

        {action}
      </div>

      {children}
    </AppCard>
  );
}
