import Header from "./Header";
import PageContainer from "./PageContainer";
import BottomNavigation from "./BottomNavigation";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <>
      <Header />

      <PageContainer>{children}</PageContainer>

      <BottomNavigation />
    </>
  );
}
