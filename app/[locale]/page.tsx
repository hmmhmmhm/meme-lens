"use client";

import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { useImageHandler } from "../../lib/hooks/use-image-handler";
import { useTouchHandler } from "../../lib/hooks/use-touch-handler";
import { useZoomPrevention } from "../../lib/hooks/use-zoom-prevention";
import { downloadCanvas } from "../../lib/utils/canvas-download";
import { useTranslations } from "next-intl";
import NoSSR from "./components/no-ssr";

// 동적 import로 hydration mismatch 방지
const CameraCanvas = dynamic(
  () =>
    import("./camera-canvas").then((mod) => ({ default: mod.CameraCanvas })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        Loading canvas...
      </div>
    ),
  }
);

const ControlPanel = dynamic(
  () =>
    import("./control-panel").then((mod) => ({ default: mod.ControlPanel })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-4">
        Loading controls...
      </div>
    ),
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
    selectedExample,
    fileInputRef,
    handleImageUpload,
    handleExampleSelect,
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
            className={`${cardBg} ${borderColor} border-b px-4 py-3 flex items-center justify-center gap-2`}
          >
            <div className="w-6 h-6">
              <img
                src="/logo.png"
                alt="Meme Lens Logo"
                className="inset-0 w-full h-full object-cover pointer-events-none"
              />
            </div>
            <h1 className="text-lg font-semibold">{t("appTitle")}</h1>
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
            onExampleSelect={handleExampleSelect}
            selectedExample={selectedExample}
            isMobile={true}
          />
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex flex-col min-h-screen">
          {/* Desktop Header */}
          <div
            className={`${cardBg} ${borderColor} border-b p-4 flex items-center justify-center gap-2`}
          >
            <div className="w-6 h-6">
              <img
                src="/logo.png"
                alt="Meme Lens Logo"
                className="inset-0 w-full h-full object-cover pointer-events-none"
              />
            </div>
            <h1 className="text-xl font-semibold">{t("appTitle")}</h1>
          </div>

          {/* Desktop Content */}
          <div className="flex-1 flex min-h-0 overflow-hidden">
            {/* Canvas Area with Example Gallery */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {/* Canvas Section - Calculated to leave exact space for Example Images */}
              <div
                className="flex items-center justify-center p-4 min-h-0"
                style={{
                  height: 'calc(100vh - 61px - max(80px, min(140px, 20vh)))'
                }}
              >
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
                  size="min(calc(100vh - 61px - max(80px, min(140px, 20vh)) - 32px), min(calc(100vw - 320px - 32px), 500px))"
                />
              </div>

              {/* Example Gallery Section - Fixed height that matches calculation above */}
              <div
                className={`${cardBg} ${borderColor} border-t flex-shrink-0 overflow-hidden`}
                style={{
                  height: 'max(80px, min(140px, 20vh))',
                  padding: '8px'
                }}
              >
                <NoSSR>
                  <div className="max-w-3xl mx-auto h-full overflow-hidden">
                    <h3
                      className="font-medium mb-1"
                      style={{
                        fontSize: 'max(10px, min(14px, calc(100vh / 50)))'
                      }}
                    >
                      {t("exampleImages")}
                    </h3>
                    <div
                      className="grid grid-cols-4 h-auto"
                      style={{
                        gap: 'max(2px, min(8px, calc(100vh / 120)))'
                      }}
                    >
                      {[
                        { id: 'example-1', path: '/example-1.webp', alt: 'Example 1' },
                        { id: 'example-2', path: '/example-2.webp', alt: 'Example 2' },
                        { id: 'example-3', path: '/example-3.webp', alt: 'Example 3' },
                        { id: 'example-4', path: '/example-4.webp', alt: 'Example 4' },
                      ].map((example) => (
                        <button
                          key={example.id}
                          onClick={() => handleExampleSelect(example.path)}
                          className={`
                            relative aspect-square rounded-sm overflow-hidden border transition-all
                            ${selectedExample === example.path
                              ? 'border-blue-500 ring-1 ring-blue-200'
                              : `${borderColor} hover:border-gray-400`
                            }
                            ${isDarkTheme ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
                          `}
                          style={{
                            height: 'calc(max(80px, min(140px, 20vh)) - 40px)',
                            width: 'calc(max(80px, min(140px, 20vh)) - 40px)',
                            maxHeight: '60px',
                            maxWidth: '60px'
                          }}
                        >
                          <img
                            src={example.path}
                            alt={example.alt}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          {selectedExample === example.path && (
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
                      ))}
                    </div>
                  </div>
                </NoSSR>
              </div>
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
              onExampleSelect={handleExampleSelect}
              selectedExample={selectedExample}
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
