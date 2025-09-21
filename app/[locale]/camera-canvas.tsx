"use client";

import React from "react";
import { useTranslations } from "next-intl";

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
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
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
    </div>
  );
}
