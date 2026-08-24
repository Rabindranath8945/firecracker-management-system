"use client";

import { usePathname } from "next/navigation";

import Header from "./Header";
import BottomNavigation from "./BottomNavigation";
import PageContainer from "./PageContainer";

import {
  DashboardProvider,
  useDashboard,
} from "@/features/dashboard/context/DashboardContext";

import { SyncProvider } from "@/features/sync/context/SyncContext";

import { NotificationProvider } from "@/features/notification/context/NotificationContext";

interface AppShellProps {
  children: React.ReactNode;
}

function AppShellContent({ children }: AppShellProps) {
  const pathname = usePathname();

  const { dashboard } = useDashboard();

  const hideBottomNavigation =
    pathname === "/sales/review" ||
    pathname === "/sales/payment" ||
    pathname === "/sales/success";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background">
      <Header dashboard={dashboard} />

      <PageContainer>{children}</PageContainer>

      {!hideBottomNavigation && <BottomNavigation />}
    </div>
  );
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <DashboardProvider>
      <SyncProvider>
        <NotificationProvider>
          <AppShellContent>{children}</AppShellContent>
        </NotificationProvider>
      </SyncProvider>
    </DashboardProvider>
  );
}
