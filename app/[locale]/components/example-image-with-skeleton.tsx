'use client';

import React, { useState } from 'react';
import { ImageSkeleton } from './skeleton-loader';

interface ExampleImageWithSkeletonProps {
  src: string;
  alt: string;
  onClick: () => void;
  isSelected: boolean;
  isDarkTheme: boolean;
  borderColor: string;
  style?: React.CSSProperties;
  className?: string;
}

export function ExampleImageWithSkeleton({
  src,
  alt,
  onClick,
  isSelected,
  isDarkTheme,
  borderColor,
  style,
  className
}: ExampleImageWithSkeletonProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageLoaded(true); // Show even if failed to load
  };

  return (
    <button
      onClick={onClick}
      className={`
        relative overflow-hidden border transition-all
        ${isSelected
          ? 'border-blue-500 ring-1 ring-blue-200'
          : `${borderColor} hover:border-gray-400`
        }
        ${isDarkTheme ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
        ${className || ''}
      `}
      style={style}
    >
      {/* Skeleton loader */}
      {!imageLoaded && (
        <div className="absolute inset-0">
          <ImageSkeleton
            aspectRatio="square"
            size="100%"
            isDarkTheme={isDarkTheme}
            className="rounded-none"
          />
        </div>
      )}

      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-200 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading="lazy"
        onLoad={handleImageLoad}
        onError={handleImageError}
      />

      {/* Selection indicator */}
      {isSelected && imageLoaded && (
        <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
          <div
            className="bg-blue-500 rounded-full"
            style={{
              padding: 'max(1px, min(2px, calc(100vh / 400)))'
            }}
          >
            <svg
              className="text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
              style={{
                width: 'max(8px, min(12px, calc(100vh / 60)))',
                height: 'max(8px, min(12px, calc(100vh / 60)))'
              }}
            >
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
    </button>
  );
}