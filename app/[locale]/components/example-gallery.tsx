'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ExampleImageWithSkeleton } from './example-image-with-skeleton';

interface ExampleImage {
  id: string;
  path: string;
  alt: string;
}

interface ExampleGalleryProps {
  onSelectExample: (imagePath: string) => void;
  selectedExample: string | null;
  isDarkTheme: boolean;
}

const exampleImages: ExampleImage[] = [
  { id: 'example-1', path: '/example-1.webp', alt: 'Example 1' },
  { id: 'example-2', path: '/example-2.webp', alt: 'Example 2' },
  { id: 'example-3', path: '/example-3.webp', alt: 'Example 3' },
  { id: 'example-4', path: '/example-4.webp', alt: 'Example 4' },
];

export function ExampleGallery({ onSelectExample, selectedExample, isDarkTheme }: ExampleGalleryProps) {
  const t = useTranslations();
  
  const cardBg = isDarkTheme ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDarkTheme ? 'border-gray-700' : 'border-gray-200';
  const hoverBg = isDarkTheme ? 'hover:bg-gray-700' : 'hover:bg-gray-100';

  return (
    <div className={`${cardBg} ${borderColor} border rounded-lg p-4 mb-4`}>
      <h3 className="text-sm font-medium mb-3">{t('exampleImages')}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {exampleImages.map((example) => (
          <ExampleImageWithSkeleton
            key={example.id}
            src={example.path}
            alt={example.alt}
            onClick={() => onSelectExample(example.path)}
            isSelected={selectedExample === example.path}
            isDarkTheme={isDarkTheme}
            borderColor={borderColor}
            className="aspect-square rounded-lg border-2"
          />
        ))}
      </div>
    </div>
  );
}