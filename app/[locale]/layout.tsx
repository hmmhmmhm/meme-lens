import type React from "react";
import type { Metadata, Viewport } from "next";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale, getTranslations} from 'next-intl/server';
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

// 다국어 메타데이터 생성
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale});
  
  // 로케일별 OpenGraph locale 매핑
  const localeMap: Record<string, string> = {
    'ko': 'ko_KR',
    'en': 'en_US', 
    'ja': 'ja_JP'
  };

  return {
    title: {
      default: t('appTitle'),
      template: `%s | ${t('appTitle')}`,
    },
    description: t('metaDescription'),
    keywords: t('metaKeywords').split(', '),
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
      locale: localeMap[locale] || 'ko_KR',
      alternateLocale: Object.values(localeMap).filter(l => l !== localeMap[locale]),
      url: `https://meme-lens.com${locale === routing.defaultLocale ? '' : `/${locale}`}`,
      title: t('appTitle'),
      description: t('metaDescription'),
      siteName: t('appTitle'),
    },
    twitter: {
      card: "summary_large_image",
      title: t('appTitle'),
      description: t('metaDescription'),
    },
    alternates: {
      languages: {
        "ko": "/ko",
        "en": "/en", 
        "ja": "/ja",
        "x-default": "/ko",
      },
    },
  };
}

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
    <html lang={locale} suppressHydrationWarning>
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
      <body className={cn("antialiased")} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <div className="flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}