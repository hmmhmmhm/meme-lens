import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // hydration mismatch 문제 완화
  experimental: {
    optimizePackageImports: ['next-intl'],
  },
  // 정적 최적화 설정
  trailingSlash: false,
  reactStrictMode: false, // 개발 중에만 false로 설정
};

export default withNextIntl(nextConfig);

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
