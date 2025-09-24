"use client";

import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { useImageHandler } from "../../lib/hooks/use-image-handler";
import { useTouchHandler } from "../../lib/hooks/use-touch-handler";
import { useZoomPrevention } from "../../lib/hooks/use-zoom-prevention";
import { downloadCanvas } from "../../lib/utils/canvas-download";
import { useTranslations } from "next-intl";
import NoSSR from "./components/no-ssr";
import { ExampleImageWithSkeleton } from "./components/example-image-with-skeleton";
import { ImageSkeleton, SkeletonLoader } from "./components/skeleton-loader";

// 동적 import로 hydration mismatch 방지
const CameraCanvas = dynamic(
  () =>
    import("./camera-canvas").then((mod) => ({ default: mod.CameraCanvas })),
  {
    ssr: false,
    loading: () => null, // Will be handled by custom loading component
  }
);

const ControlPanel = dynamic(
  () =>
    import("./control-panel").then((mod) => ({ default: mod.ControlPanel })),
  {
    ssr: false,
    loading: () => null, // Will be handled by custom loading component
  }
);

// Canvas loading component with skeleton
function CanvasLoadingSkeleton({ isDarkTheme, size }: { isDarkTheme: boolean; size: string }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "22.37%",
      }}
    >
      <ImageSkeleton
        aspectRatio="canvas"
        size="100%"
        isDarkTheme={isDarkTheme}
        className="rounded-[22.37%]"
      />
    </div>
  );
}

// Control panel loading skeleton
function ControlPanelLoadingSkeleton({ isDarkTheme, isMobile }: { isDarkTheme: boolean; isMobile?: boolean }) {
  if (isMobile) {
    return (
      <div className={`${isDarkTheme ? 'bg-gray-800' : 'bg-white'} ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'} border-t p-4 space-y-4`}>
        <SkeletonLoader height="48px" isDarkTheme={isDarkTheme} className="rounded" />
        <SkeletonLoader height="20px" isDarkTheme={isDarkTheme} className="rounded" />
        <SkeletonLoader height="8px" isDarkTheme={isDarkTheme} className="rounded-full" />
        <SkeletonLoader height="20px" isDarkTheme={isDarkTheme} className="rounded" />
        <SkeletonLoader height="8px" isDarkTheme={isDarkTheme} className="rounded-full" />
        <SkeletonLoader height="48px" isDarkTheme={isDarkTheme} className="rounded" />
        <SkeletonLoader height="48px" isDarkTheme={isDarkTheme} className="rounded" />
        <div className="flex gap-2">
          <SkeletonLoader height="48px" isDarkTheme={isDarkTheme} className="rounded flex-1" />
          <SkeletonLoader height="48px" isDarkTheme={isDarkTheme} className="rounded flex-1" />
        </div>
      </div>
    );
  }

  return (
    <div className={`w-80 ${isDarkTheme ? 'bg-gray-800' : 'bg-white'} ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'} border-l p-6 space-y-8`}>
      <SkeletonLoader height="24px" width="120px" isDarkTheme={isDarkTheme} className="rounded" />
      <SkeletonLoader height="48px" isDarkTheme={isDarkTheme} className="rounded" />
      <div className="space-y-3">
        <SkeletonLoader height="16px" width="80px" isDarkTheme={isDarkTheme} className="rounded" />
        <SkeletonLoader height="8px" isDarkTheme={isDarkTheme} className="rounded-full" />
      </div>
      <div className="space-y-3">
        <SkeletonLoader height="16px" width="60px" isDarkTheme={isDarkTheme} className="rounded" />
        <SkeletonLoader height="8px" isDarkTheme={isDarkTheme} className="rounded-full" />
      </div>
      <SkeletonLoader height="48px" isDarkTheme={isDarkTheme} className="rounded" />
      <SkeletonLoader height="48px" isDarkTheme={isDarkTheme} className="rounded" />
      <SkeletonLoader height="48px" isDarkTheme={isDarkTheme} className="rounded" />
      <SkeletonLoader height="48px" isDarkTheme={isDarkTheme} className="rounded" />
    </div>
  );
}

export default function Home() {
  const t = useTranslations();
  const [lensOpacity, setLensOpacity] = useState(0.75);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [canvasLoaded, setCanvasLoaded] = useState(false);
  const [controlsLoaded, setControlsLoaded] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Handle loading states
  React.useEffect(() => {
    // Simulate loading times
    const canvasTimer = setTimeout(() => setCanvasLoaded(true), 100);
    const controlsTimer = setTimeout(() => setControlsLoaded(true), 200);
    return () => {
      clearTimeout(canvasTimer);
      clearTimeout(controlsTimer);
    };
  }, []);

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
            {canvasLoaded ? (
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
            ) : (
              <CanvasLoadingSkeleton
                isDarkTheme={isDarkTheme}
                size="min(90vw, 90vh, 400px)"
              />
            )}
          </div>

          {/* Mobile Controls */}
          {controlsLoaded ? (
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
          ) : (
            <ControlPanelLoadingSkeleton isDarkTheme={isDarkTheme} isMobile={true} />
          )}
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
                {canvasLoaded ? (
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
                ) : (
                  <CanvasLoadingSkeleton
                    isDarkTheme={isDarkTheme}
                    size="min(calc(100vh - 61px - max(80px, min(140px, 20vh)) - 32px), min(calc(100vw - 320px - 32px), 500px))"
                  />
                )}
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
                        <ExampleImageWithSkeleton
                          key={example.id}
                          src={example.path}
                          alt={example.alt}
                          onClick={() => handleExampleSelect(example.path)}
                          isSelected={selectedExample === example.path}
                          isDarkTheme={isDarkTheme}
                          borderColor={borderColor}
                          className="aspect-square rounded-sm"
                          style={{
                            height: 'calc(max(80px, min(140px, 20vh)) - 40px)',
                            width: 'calc(max(80px, min(140px, 20vh)) - 40px)',
                            maxHeight: '60px',
                            maxWidth: '60px'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </NoSSR>
              </div>
            </div>

            {/* Desktop Controls */}
            {controlsLoaded ? (
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
            ) : (
              <ControlPanelLoadingSkeleton isDarkTheme={isDarkTheme} isMobile={false} />
            )}
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
