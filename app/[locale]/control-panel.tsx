'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Download, Upload, RotateCcw, Sun, Moon, Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';

// 언어 모달을 동적 import로 hydration mismatch 방지
const LanguageModal = dynamic(
  () => import('./components/language-modal').then((mod) => ({ default: mod.LanguageModal })),
  { 
    ssr: false,
    loading: () => null
  }
);

interface ControlPanelProps {
  lensOpacity: number;
  setLensOpacity: (opacity: number) => void;
  imageScale: number;
  setImageScale: (scale: number) => void;
  isDarkTheme: boolean;
  setIsDarkTheme: (theme: boolean) => void;
  isAnimatedFile: boolean;
  onUploadClick: () => void;
  onReset: () => void;
  onDownload: () => void;
  isMobile?: boolean;
}

export function ControlPanel({
  lensOpacity,
  setLensOpacity,
  imageScale,
  setImageScale,
  isDarkTheme,
  setIsDarkTheme,
  isAnimatedFile,
  onUploadClick,
  onReset,
  onDownload,
  isMobile = false,
}: ControlPanelProps) {
  const t = useTranslations();
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  
  const cardBg = isDarkTheme ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDarkTheme ? 'border-gray-700' : 'border-gray-200';

  const buttonStyle = `${isDarkTheme ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`;

  if (isMobile) {
    return (
      <>
        <div className={`${cardBg} ${borderColor} border-t p-4 space-y-4`}>
          {/* Upload Button */}
          <div>
            <button
              onClick={onUploadClick}
              className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded ${buttonStyle}`}
            >
              <Upload size={16} />
              {t('uploadImageVideo')}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('lensOpacity')}: {Math.round(lensOpacity * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={lensOpacity}
              onChange={(e) => setLensOpacity(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider-monochrome"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              {t('zoom')}: {Math.round(imageScale * 100)}%
            </label>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={imageScale}
              onChange={(e) => setImageScale(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider-monochrome"
            />
          </div>

          {/* Language Selector */}
          <div>
            <button
              onClick={() => setIsLanguageModalOpen(true)}
              className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded ${buttonStyle}`}
            >
              <Globe size={16} />
              {t('language')}
            </button>
          </div>

          {/* Theme Toggle */}
          <div>
            <button
              onClick={() => setIsDarkTheme(!isDarkTheme)}
              className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded ${buttonStyle}`}
            >
              {isDarkTheme ? <Sun size={16} /> : <Moon size={16} />}
              {isDarkTheme ? t('switchToLight') : t('switchToDark')}
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onReset}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded ${buttonStyle}`}
            >
              <RotateCcw size={16} />
              {t('reset')}
            </button>
            <button
              onClick={onDownload}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded ${buttonStyle}`}
            >
              <Download size={16} />
              {t('save')}
            </button>
          </div>
          
          {isAnimatedFile && (
            <div className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'} text-center mt-2`}>
              {t('animatedFileNote')}
            </div>
          )}
        </div>
        
        <LanguageModal
          isOpen={isLanguageModalOpen}
          onClose={() => setIsLanguageModalOpen(false)}
          isDarkTheme={isDarkTheme}
        />
      </>
    );
  }

  return (
    <>
      <div className={`w-80 ${cardBg} ${borderColor} border-l p-6`}>
        <h2 className="text-lg font-semibold mb-6">{t('controls')}</h2>
        
        {/* Upload Button */}
        <div className="mb-8">
          <button
            onClick={onUploadClick}
            className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded ${buttonStyle}`}
          >
            <Upload size={16} />
            {t('uploadImageVideo')}
          </button>
        </div>

        {/* Lens Opacity Control */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-3">
            {t('lensOpacity')}: {Math.round(lensOpacity * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={lensOpacity}
            onChange={(e) => setLensOpacity(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider-monochrome"
          />
        </div>

        {/* Zoom Control */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-3">
            {t('zoom')}: {Math.round(imageScale * 100)}%
          </label>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={imageScale}
            onChange={(e) => setImageScale(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider-monochrome"
          />
        </div>

        {/* Language Selector */}
        <div className="mb-8">
          <button
            onClick={() => setIsLanguageModalOpen(true)}
            className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded ${buttonStyle}`}
          >
            <Globe size={16} />
            {t('language')}
          </button>
        </div>

        {/* Theme Toggle */}
        <div className="mb-8">
          <button
            onClick={() => setIsDarkTheme(!isDarkTheme)}
            className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded ${buttonStyle}`}
          >
            {isDarkTheme ? <Sun size={16} /> : <Moon size={16} />}
            {isDarkTheme ? t('switchToLight') : t('switchToDark')}
          </button>
        </div>

        {/* Position Reset */}
        <div className="mb-8">
          <button
            onClick={onReset}
            className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded ${buttonStyle}`}
          >
            <RotateCcw size={16} />
            {t('resetPosition')}
          </button>
        </div>

        {/* Download Button */}
        <div className="mb-8">
          <button
            onClick={onDownload}
            className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded ${buttonStyle}`}
          >
            <Download size={16} />
            {t('saveImage')}
          </button>
        </div>

        {isAnimatedFile && (
          <div className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'} text-center mb-4`}>
            {t('animatedFileNote')}
          </div>
        )}
      </div>
      
      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        isDarkTheme={isDarkTheme}
      />
    </>
  );
}