import type { Metadata } from "next";
import { routing } from "@/src/i18n/routing";

export const metadata: Metadata = {
  title: {
    default: "MemeLens",
    template: "%s | MemeLens",
  },
  description: "카메라 렌즈 효과로 캐릭터 이미지를 꾸며보세요",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}