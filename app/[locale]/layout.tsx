import type React from "react";
import type { Metadata, Viewport } from "next";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {routing} from '@/src/i18n/routing';
import "./globals.css";

import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export const metadata: Metadata = {
  title: {
    default: "MemeLens",
    template: "%s | MemeLens",
  },
  description: "카메라 렌즈 효과로 캐릭터 이미지를 꾸며보세요",
  keywords: ["meme", "lens", "camera", "photo", "editor", "밈", "렌즈", "카메라", "사진", "편집", "ミーム", "レンズ", "カメラ", "写真", "編集"],
  authors: [{ name: "MemeLens" }],
  creator: "MemeLens",
  publisher: "MemeLens",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    alternateLocale: ["en_US", "ja_JP"],
    url: "https://meme-lens.com",
    title: "MemeLens",
    description: "카메라 렌즈 효과로 캐릭터 이미지를 꾸며보세요",
    siteName: "MemeLens",
  },
  twitter: {
    card: "summary_large_image",
    title: "MemeLens",
    description: "카메라 렌즈 효과로 캐릭터 이미지를 꾸며보세요",
  },
  alternates: {
    languages: {
      "ko": "/ko",
      "en": "/en", 
      "ja": "/ja",
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function LocaleLayout({
  children,
  params
}: Props) {
  const {locale} = await params;
  
  // Enable static rendering
  setRequestLocale(locale);
  
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, shrink-to-fit=no"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="alternate" hrefLang="ko" href="/ko" />
        <link rel="alternate" hrefLang="en" href="/en" />
        <link rel="alternate" hrefLang="ja" href="/ja" />
        <link rel="alternate" hrefLang="x-default" href="/" />
      </head>
      <body className={cn("antialiased")}>
        <NextIntlClientProvider messages={messages}>
          <div className="flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}