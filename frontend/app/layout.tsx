import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import Providers from "./providers";
import OfflineInitializer from "@/libs/offline/store/OfflineInitializer";

export const metadata: Metadata = {
  title: "OneHub | One Place. Every Business.",
  description:
    "Modern ERP for inventory, sales, purchases, accounting and reports.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster richColors position="top-center" />
        <Providers>
          <OfflineInitializer>{children}</OfflineInitializer>
        </Providers>
      </body>
    </html>
  );
}
