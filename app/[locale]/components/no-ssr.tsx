'use client';

import dynamic from 'next/dynamic';
import React from 'react';

interface NoSSRProps {
  children: React.ReactNode;
}

/**
 * 서버 사이드 렌더링을 완전히 비활성화하는 컴포넌트
 * 브라우저 확장 프로그램 간섭을 완전히 차단
 */
const NoSSR = ({ children }: NoSSRProps) => {
  return <>{children}</>;
};

export default dynamic(() => Promise.resolve(NoSSR), {
  ssr: false,
});