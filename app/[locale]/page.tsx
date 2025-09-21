"use client";

import React, { useState, useRef } from "react";
import dynamic from 'next/dynamic';
import { useImageHandler } from "../../lib/hooks/use-image-handler";
import { useTouchHandler } from "../../lib/hooks/use-touch-handler";
import { useZoomPrevention } from "../../lib/hooks/use-zoom-prevention";
import { downloadCanvas } from "../../lib/utils/canvas-download";
import { useTranslations } from 'next-intl';
import NoSSR from "./components/no-ssr";

// 동적 import로 hydration mismatch 방지
const CameraCanvas = dynamic(
  () => import("./camera-canvas").then((mod) => ({ default: mod.CameraCanvas })),
  { 
    ssr: false,
    loading: () => <div className="flex items-center justify-center min-h-[400px]">Loading canvas...</div>
  }
);

const ControlPanel = dynamic(
  () => import("./control-panel").then((mod) => ({ default: mod.ControlPanel })),
  { 
    ssr: false,
    loading: () => <div className="flex items-center justify-center p-4">Loading controls...</div>
  }
);

export default function Home() {
  const t = useTranslations();
  const [lensOpacity, setLensOpacity] = useState(0.75);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const canvasRef = useRef<HTMLDivElement>(null);

  const {
    imagePosition,
    setImagePosition,
    imageScale,
    setImageScale,
    isAnimatedFile,
    displayImage,
    downloadImage,
    fileInputRef,
    handleImageUpload,
    resetImagePosition,
  } = useImageHandler();

  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleTouchEnd,
    handleTouchStart,
  } = useTouchHandler(
    imagePosition,
    setImagePosition,
    imageScale,
    setImageScale
  );

  useZoomPrevention(imageScale, setImageScale);

  const handleDownload = () => {
    downloadCanvas(
      downloadImage,
      isDarkTheme,
      imagePosition,
      imageScale,
      lensOpacity,
      canvasRef
    );
  };

  const themeClass = isDarkTheme ? "dark" : "";
  const bgColor = isDarkTheme ? "bg-gray-900" : "bg-gray-50";
  const textColor = isDarkTheme ? "text-white" : "text-gray-900";
  const cardBg = isDarkTheme ? "bg-gray-800" : "bg-white";
  const borderColor = isDarkTheme ? "border-gray-700" : "border-gray-200";

  return (
    <NoSSR>
      <div
        className={`min-h-screen ${bgColor} ${textColor} ${themeClass} select-none`}
        style={{
          touchAction: "pan-x pan-y",
          zoom: 1,
          transform: "scale(1)",
          WebkitTransform: "scale(1)",
          MozTransform: "scale(1)",
        }}
      >
      {/* Mobile/Tablet Layout */}
      <div className="flex flex-col lg:hidden">
        {/* Mobile Header */}
        <div
          className={`${cardBg} ${borderColor} border-b px-4 py-3 flex items-center justify-center`}
        >
          <h1 className="text-lg font-semibold">{t('appTitle')}</h1>
        </div>

        {/* Mobile Canvas */}
        <div className="flex-1 flex items-center justify-center p-4">
          <CameraCanvas
            displayImage={displayImage}
            imagePosition={imagePosition}
            imageScale={imageScale}
            lensOpacity={lensOpacity}
            isDarkTheme={isDarkTheme}
            canvasRef={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            size="min(90vw, 90vh, 400px)"
          />
        </div>

        {/* Mobile Controls */}
        <ControlPanel
          lensOpacity={lensOpacity}
          setLensOpacity={setLensOpacity}
          imageScale={imageScale}
          setImageScale={setImageScale}
          isDarkTheme={isDarkTheme}
          setIsDarkTheme={setIsDarkTheme}
          isAnimatedFile={isAnimatedFile}
          onUploadClick={() => fileInputRef.current?.click()}
          onReset={resetImagePosition}
          onDownload={handleDownload}
          isMobile={true}
        />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-col min-h-screen">
        {/* Desktop Header */}
        <div
          className={`${cardBg} ${borderColor} border-b p-4 flex items-center justify-center`}
        >
          <h1 className="text-xl font-semibold">{t('appTitle')}</h1>
        </div>

        {/* Desktop Content */}
        <div className="flex-1 flex">
          {/* Canvas Area */}
          <div className="flex-1 flex items-center justify-center p-8">
            <CameraCanvas
              displayImage={displayImage}
              imagePosition={imagePosition}
              imageScale={imageScale}
              lensOpacity={lensOpacity}
              isDarkTheme={isDarkTheme}
              canvasRef={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              size="min(70vh, 600px)"
            />
          </div>

          {/* Desktop Controls */}
          <ControlPanel
            lensOpacity={lensOpacity}
            setLensOpacity={setLensOpacity}
            imageScale={imageScale}
            setImageScale={setImageScale}
            isDarkTheme={isDarkTheme}
            setIsDarkTheme={setIsDarkTheme}
            isAnimatedFile={isAnimatedFile}
            onUploadClick={() => fileInputRef.current?.click()}
            onReset={resetImagePosition}
            onDownload={handleDownload}
            isMobile={false}
          />
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      </div>
    </NoSSR>
  );
}
