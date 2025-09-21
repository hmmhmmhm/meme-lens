'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';

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
          <button
            key={example.id}
            onClick={() => onSelectExample(example.path)}
            className={`
              relative aspect-square rounded-lg overflow-hidden border-2 transition-all
              ${selectedExample === example.path 
                ? 'border-blue-500 ring-2 ring-blue-200' 
                : `${borderColor} ${hoverBg} hover:border-gray-400`
              }
            `}
          >
            <img
              src={example.path}
              alt={example.alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {selectedExample === example.path && (
              <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                <div className="bg-blue-500 rounded-full p-1">
                  <Check size={16} className="text-white" />
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}