import createMiddleware from 'next-intl/middleware';
import {routing} from './src/i18n/routing';

export default createMiddleware(routing);

export const config = {
  // next-intl에서 처리할 경로들을 매칭
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};