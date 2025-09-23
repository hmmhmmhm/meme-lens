"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ImageSkeleton } from "./components/skeleton-loader";

interface CameraCanvasProps {
  displayImage: string;
  imagePosition: { x: number; y: number };
  imageScale: number;
  lensOpacity: number;
  isDarkTheme: boolean;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  size: string;
}

export function CameraCanvas({
  displayImage,
  imagePosition,
  imageScale,
  lensOpacity,
  isDarkTheme,
  canvasRef,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  size,
}: CameraCanvasProps) {
  const t = useTranslations();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [coverLoaded, setCoverLoaded] = useState(false);
  const [lensLoaded, setLensLoaded] = useState(false);

  const allImagesLoaded = imageLoaded && coverLoaded && lensLoaded;

  useEffect(() => {
    setImageLoaded(false);
    setCoverLoaded(false);
    setLensLoaded(false);

    // Load user image
    if (displayImage && !displayImage.endsWith('.mp4') && !displayImage.endsWith('.webm') && !displayImage.endsWith('.mov')) {
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setImageLoaded(true); // Show even if failed
      img.src = displayImage;
    } else if (displayImage.endsWith('.mp4') || displayImage.endsWith('.webm') || displayImage.endsWith('.mov')) {
      // For videos, set as loaded immediately
      setImageLoaded(true);
    }

    // Load cover image
    const coverImg = new Image();
    coverImg.onload = () => setCoverLoaded(true);
    coverImg.onerror = () => setCoverLoaded(true);
    coverImg.src = `/ios-26-camera-${isDarkTheme ? "dark" : "light"}-cover.webp`;

    // Load lens image
    const lensImg = new Image();
    lensImg.onload = () => setLensLoaded(true);
    lensImg.onerror = () => setLensLoaded(true);
    lensImg.src = `/ios-26-camera-${isDarkTheme ? "dark" : "light"}-lens.webp`;
  }, [displayImage, isDarkTheme]);
  return (
    <div
      ref={canvasRef}
      className="relative overflow-hidden canvas-container"
      style={{
        width: size,
        height: size,
        borderRadius: "22.37%",
        touchAction: "none",
      }}
      onMouseMove={allImagesLoaded ? onMouseMove : undefined}
      onMouseUp={allImagesLoaded ? onMouseUp : undefined}
      onMouseLeave={allImagesLoaded ? onMouseUp : undefined}
      onTouchMove={allImagesLoaded ? onTouchMove : undefined}
      onTouchEnd={allImagesLoaded ? onTouchEnd : undefined}
    >
      {/* Loading Skeleton */}
      {!allImagesLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <ImageSkeleton
            aspectRatio="canvas"
            size="100%"
            isDarkTheme={isDarkTheme}
            className="rounded-[22.37%]"
          />
        </div>
      )}

      {/* Canvas Content - Only show when all images are loaded */}
      {allImagesLoaded && (
        <>
          {/* User Image/Video (Bottom Layer with proper clipping) */}
          <div
            className="absolute inset-4 overflow-hidden cursor-move"
            style={{ zIndex: 1, borderRadius: "20%" }}
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
          >
            {displayImage.endsWith(".mp4") ||
            displayImage.endsWith(".webm") ||
            displayImage.endsWith(".mov") ? (
              <video
                src={displayImage}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                style={{
                  transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${imageScale})`,
                  transformOrigin: "center",
                }}
                draggable={false}
              />
            ) : (
              <img
                src={displayImage}
                alt={t("userCharacter")}
                className="w-full h-full object-cover"
                style={{
                  transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${imageScale})`,
                  transformOrigin: "center",
                }}
                draggable={false}
              />
            )}
          </div>

          {/* Cover Image (Middle Layer) */}
          <img
            src={`/ios-26-camera-${isDarkTheme ? "dark" : "light"}-cover.webp`}
            alt={t("cameraCover")}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ opacity: 1, zIndex: 2, borderRadius: "22.37%" }}
          />

          {/* Lens Image (Top Layer) */}
          <img
            src={`/ios-26-camera-${isDarkTheme ? "dark" : "light"}-lens.webp`}
            alt={t("cameraLens")}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ opacity: lensOpacity, zIndex: 3, borderRadius: "22.37%" }}
          />
        </>
      )}
    </div>
  );
}
