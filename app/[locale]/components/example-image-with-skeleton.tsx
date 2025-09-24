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
          ? isDarkTheme
            ? 'border-gray-300 ring-1 ring-gray-400'
            : 'border-gray-700 ring-1 ring-gray-600'
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
        <div className="absolute top-1 right-1">
          <div className={`rounded-full p-1 shadow-lg ${
            isDarkTheme ? 'bg-white' : 'bg-gray-900'
          }`}>
            <svg
              className={isDarkTheme ? 'text-gray-900' : 'text-white'}
              fill="currentColor"
              viewBox="0 0 20 20"
              style={{
                width: 'max(10px, min(16px, calc(100vh / 50)))',
                height: 'max(10px, min(16px, calc(100vh / 50)))'
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