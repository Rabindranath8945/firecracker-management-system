import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Firecracker Management System",
  description: "Enterprise Firecracker Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
