'use client';

import React from 'react';

interface SkeletonLoaderProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  isDarkTheme?: boolean;
}

export function SkeletonLoader({
  width = '100%',
  height = '100%',
  className = '',
  isDarkTheme = false
}: SkeletonLoaderProps) {
  const baseColor = isDarkTheme ? 'bg-gray-700' : 'bg-gray-200';
  const shimmerColor = isDarkTheme ? 'bg-gray-600' : 'bg-gray-100';

  return (
    <div
      className={`relative overflow-hidden rounded ${baseColor} ${className}`}
      style={{ width, height }}
    >
      <div
        className={`absolute inset-0 -translate-x-full animate-[shimmer_1.5s_ease-in-out_infinite] ${shimmerColor}`}
        style={{
          background: `linear-gradient(90deg, transparent, ${isDarkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)'}, transparent)`,
        }}
      />
      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

interface ImageSkeletonProps {
  aspectRatio?: 'square' | 'canvas' | 'auto';
  size?: string;
  isDarkTheme?: boolean;
  className?: string;
}

export function ImageSkeleton({
  aspectRatio = 'square',
  size = '100%',
  isDarkTheme = false,
  className = ''
}: ImageSkeletonProps) {
  const aspectClass = {
    square: 'aspect-square',
    canvas: 'aspect-square',
    auto: ''
  }[aspectRatio];

  return (
    <div
      className={`${aspectClass} ${className}`}
      style={aspectRatio === 'auto' ? { width: size, height: size } : { width: size }}
    >
      <SkeletonLoader isDarkTheme={isDarkTheme} className="rounded-lg" />
    </div>
  );
}