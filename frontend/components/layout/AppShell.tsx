"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import BottomNavigation from "./BottomNavigation";
import PageContainer from "./PageContainer";

import { useDashboard } from "@/features/dashboard/hooks/useDashboard";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { dashboard, loading } = useDashboard();

  const hideBottomNavigation = [
    "/sales/review",
    "/sales/payment",
    "/sales/success",
  ].includes(pathname);

  return (
    <>
      {!loading && dashboard && <Header dashboard={dashboard} />}

      <PageContainer>{children}</PageContainer>

      {!hideBottomNavigation && <BottomNavigation />}
    </>
  );
}
