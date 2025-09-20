import type React from "react";
import type { Metadata } from "next";
import "./globals.css";

import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "MemeLens",
  description: "MemeLens",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={cn("antialiased")}>
        <div className="flex min-h-screen flex-col">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
