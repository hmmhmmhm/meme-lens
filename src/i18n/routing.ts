import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  // 지원할 언어들
  locales: ['ko', 'en', 'ja'],
  
  // 기본 언어 (한국어)
  defaultLocale: 'ko'
});