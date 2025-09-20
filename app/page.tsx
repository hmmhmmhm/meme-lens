'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Download, Upload, RotateCcw, Sun, Moon } from 'lucide-react';

export default function Home() {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [imageScale, setImageScale] = useState(1);
  const [lensOpacity, setLensOpacity] = useState(0.75);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastTouchDistance, setLastTouchDistance] = useState(0);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [isAnimatedFile, setIsAnimatedFile] = useState(true); // Default is true for mp4
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is animated (GIF or video)
      const isAnimated = file.type === 'image/gif' || file.type.startsWith('video/');
      setIsAnimatedFile(isAnimated);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - imagePosition.x,
      y: e.clientY - imagePosition.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getTouchDistance = (touches: React.TouchList | TouchList) => {
    if (touches.length < 2) return 0;
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Always prevent default to completely stop page zoom
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    
    // Only allow single finger drag, completely disable multitouch zoom
    if (e.touches.length === 1 && isDragging) {
      // Single finger drag
      const rect = e.currentTarget.getBoundingClientRect();
      const touch = e.touches[0];
      setImagePosition({
        x: touch.clientX - rect.left - dragStart.x,
        y: touch.clientY - rect.top - dragStart.y,
      });
    }
    
    // Block any multitouch gestures completely
    if (e.touches.length >= 2) {
      setLastTouchDistance(0);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    // Always prevent default to completely stop page zoom
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    
    // Reset touch states
    setLastTouchDistance(0);
    
    if (e.touches.length === 0) {
      setIsDragging(false);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    try {
      e.preventDefault();
      e.stopPropagation();
    } catch (error) {
      // Ignore errors for passive event listeners
      console.log('Wheel event prevention failed:', error);
    }
    
    const scaleDelta = e.deltaY > 0 ? 0.9 : 1.1;
    const proposedScale = imageScale * scaleDelta;
    const minScale = 0.5;
    const maxScale = 3.0;
    
    // Apply same strict boundary logic as touch
    let newScale = imageScale;
    if (proposedScale >= minScale && proposedScale <= maxScale) {
      newScale = proposedScale;
    } else if (proposedScale < minScale && imageScale > minScale) {
      newScale = minScale;
    } else if (proposedScale > maxScale && imageScale < maxScale) {
      newScale = maxScale;
    }
    
    setImageScale(newScale);
  };

  const handleDownload = async () => {
    if (!canvasRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.src = src;
      });
    };

    try {
      const userImg = await loadImage(downloadImage);
      const coverImg = await loadImage(`/ios-26-camera-${isDarkTheme ? 'dark' : 'light'}-cover.webp`);
      const lensImg = await loadImage(`/ios-26-camera-${isDarkTheme ? 'dark' : 'light'}-lens.webp`);

      // Create clipping path for rounded corners
      const radius = 1024 * 0.2237; // 22.37% of 1024
      ctx.beginPath();
      ctx.roundRect(0, 0, 1024, 1024, radius);
      ctx.clip();
      
      // Draw user image with proper scaling and positioning
      const clipPadding = 32; // equivalent to inset-4 (16px * 2)
      const clippedSize = 1024 - clipPadding * 2;
      
      // Get the actual display size of the canvas element
      const canvasElement = canvasRef.current;
      const displayWidth = canvasElement.clientWidth;
      
      // Calculate the scale ratio between display size and actual canvas size
      const displayToCanvasRatio = 1024 / displayWidth;
      
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(clipPadding, clipPadding, clippedSize, clippedSize, radius * 0.85);
      ctx.clip();
      
      // Calculate center position for transform origin
      const centerX = clipPadding + clippedSize / 2;
      const centerY = clipPadding + clippedSize / 2;
      
      // Scale position and transforms to match canvas coordinates
      const scaledX = imagePosition.x * displayToCanvasRatio;
      const scaledY = imagePosition.y * displayToCanvasRatio;
      
      // Apply transforms with scaled position
      ctx.translate(centerX + scaledX, centerY + scaledY);
      ctx.scale(imageScale, imageScale);
      
      // Draw image using object-cover behavior (fill the container, maintain aspect ratio)
      const imageAspectRatio = userImg.naturalWidth / userImg.naturalHeight;
      const containerAspectRatio = 1; // Square container
      
      let sourceWidth, sourceHeight, sourceX, sourceY;
      
      if (imageAspectRatio > containerAspectRatio) {
        // Image is wider - fit height and crop sides
        sourceHeight = userImg.naturalHeight;
        sourceWidth = userImg.naturalHeight * containerAspectRatio;
        sourceX = (userImg.naturalWidth - sourceWidth) / 2;
        sourceY = 0;
      } else {
        // Image is taller or same - fit width and crop top/bottom
        sourceWidth = userImg.naturalWidth;
        sourceHeight = userImg.naturalWidth / containerAspectRatio;
        sourceX = 0;
        sourceY = (userImg.naturalHeight - sourceHeight) / 2;
      }
      
      // Draw image centered at origin using object-cover behavior
      ctx.drawImage(
        userImg,
        sourceX, sourceY, sourceWidth, sourceHeight,
        -clippedSize / 2, -clippedSize / 2, clippedSize, clippedSize
      );
      
      ctx.restore();
      
      // Draw cover image at full opacity
      ctx.globalAlpha = 1;
      ctx.drawImage(coverImg, 0, 0, 1024, 1024);
      
      // Draw lens image with opacity
      ctx.globalAlpha = lensOpacity;
      ctx.drawImage(lensImg, 0, 0, 1024, 1024);

      const link = document.createElement('a');
      link.download = 'meme-lens-result.png';
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const displayImage = userImage || '/miku-monitoring.mp4';
  const downloadImage = userImage ? (isAnimatedFile ? '/miku-monitoring.webp' : userImage) : '/miku-monitoring.webp';
  
  // Set animated file flag based on default or user image
  useEffect(() => {
    if (!userImage) {
      setIsAnimatedFile(true); // Default mp4 is animated
    }
  }, [userImage]);

  // Global touch event prevention and wheel handling
  useEffect(() => {
    const preventZoom = (e: TouchEvent) => {
      // Block all multitouch everywhere to prevent page zoom
      if (e.touches.length > 1) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }
    };

    const preventGesture = (e: Event) => {
      // Check if the gesture is within a canvas container
      const target = e.target as Element;
      const isCanvasArea = target?.closest('.canvas-container') !== null;
      
      // Always prevent gestures - they can trigger page zoom
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    };

    const preventWheel = (e: WheelEvent) => {
      // Check if the wheel event is within a canvas container
      const target = e.target as Element;
      const isCanvasArea = target?.closest('.canvas-container') !== null;
      
      // Block Ctrl/Cmd + wheel everywhere to prevent page zoom
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }
    };

    const preventKeyZoom = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '0' || e.key === '=')) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }
    };

    // Add listeners with capture phase and non-passive
    const options = { passive: false, capture: true };
    
    document.addEventListener('touchstart', preventZoom, options);
    document.addEventListener('touchmove', preventZoom, options);
    document.addEventListener('touchend', preventZoom, options);
    document.addEventListener('gesturestart', preventGesture, options);
    document.addEventListener('gesturechange', preventGesture, options);
    document.addEventListener('gestureend', preventGesture, options);
    document.addEventListener('wheel', preventWheel, options);
    document.addEventListener('keydown', preventKeyZoom, options);
    
    // Also add to window
    window.addEventListener('touchstart', preventZoom, options);
    window.addEventListener('touchmove', preventZoom, options);
    window.addEventListener('touchend', preventZoom, options);
    window.addEventListener('gesturestart', preventGesture, options);
    window.addEventListener('gesturechange', preventGesture, options);
    window.addEventListener('gestureend', preventGesture, options);
    window.addEventListener('wheel', preventWheel, options);
    window.addEventListener('keydown', preventKeyZoom, options);

    // Add specific wheel event listener for canvas areas
    const canvasWheelHandler = (e: WheelEvent) => {
      const target = e.target as Element;
      const isCanvasArea = target?.closest('.canvas-container') !== null;
      
      if (isCanvasArea) {
        e.preventDefault();
        e.stopPropagation();
        
        // Handle custom zoom logic here
        const scaleDelta = e.deltaY > 0 ? 0.9 : 1.1;
        const proposedScale = imageScale * scaleDelta;
        const minScale = 0.5;
        const maxScale = 3.0;
        
        let newScale = imageScale;
        if (proposedScale >= minScale && proposedScale <= maxScale) {
          newScale = proposedScale;
        } else if (proposedScale < minScale && imageScale > minScale) {
          newScale = minScale;
        } else if (proposedScale > maxScale && imageScale < maxScale) {
          newScale = maxScale;
        }
        
        setImageScale(newScale);
      }
    };
    
    // Add non-passive wheel listener for canvas areas
    document.addEventListener('wheel', canvasWheelHandler, { passive: false, capture: true });

    return () => {
      document.removeEventListener('touchstart', preventZoom, true);
      document.removeEventListener('touchmove', preventZoom, true);
      document.removeEventListener('touchend', preventZoom, true);
      document.removeEventListener('gesturestart', preventGesture, true);
      document.removeEventListener('gesturechange', preventGesture, true);
      document.removeEventListener('gestureend', preventGesture, true);
      document.removeEventListener('wheel', preventWheel, true);
      document.removeEventListener('wheel', canvasWheelHandler, true);
      document.removeEventListener('keydown', preventKeyZoom, true);
      
      window.removeEventListener('touchstart', preventZoom, true);
      window.removeEventListener('touchmove', preventZoom, true);
      window.removeEventListener('touchend', preventZoom, true);
      window.removeEventListener('gesturestart', preventGesture, true);
      window.removeEventListener('gesturechange', preventGesture, true);
      window.removeEventListener('gestureend', preventGesture, true);
      window.removeEventListener('wheel', preventWheel, true);
      window.removeEventListener('keydown', preventKeyZoom, true);
    };
  }, [imageScale]); // Add imageScale dependency for wheel handler
  const themeClass = isDarkTheme ? 'dark' : '';
  const bgColor = isDarkTheme ? 'bg-gray-900' : 'bg-gray-50';
  const textColor = isDarkTheme ? 'text-white' : 'text-gray-900';
  const cardBg = isDarkTheme ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDarkTheme ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} ${themeClass} select-none`} style={{ touchAction: 'pan-x pan-y', zoom: 1, transform: 'scale(1)', WebkitTransform: 'scale(1)', MozTransform: 'scale(1)' }}>
      {/* Mobile/Tablet Layout */}
      <div className="flex flex-col lg:hidden">
        {/* Mobile Header */}
        <div className={`${cardBg} ${borderColor} border-b px-4 py-3 flex items-center justify-center`}>
          <h1 className="text-lg font-semibold">Meme Lens</h1>
        </div>

        {/* Mobile Canvas */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div 
            ref={canvasRef}
            className="relative overflow-hidden canvas-container"
            style={{ 
              width: 'min(90vw, 90vh, 400px)', 
              height: 'min(90vw, 90vh, 400px)',
              borderRadius: '22.37%',
              touchAction: 'none',
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* User Image (Bottom Layer with proper clipping) */}
            <div 
              className="absolute inset-4 overflow-hidden cursor-move"
              style={{ zIndex: 1, borderRadius: '20%' }}
              onMouseDown={handleMouseDown}
              onTouchStart={(e) => {
                console.log('Touch start:', e.touches.length);
                // Always prevent default to stop page zoom completely
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                
                // Only allow single finger drag, block multitouch completely
                if (e.touches.length === 1) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const touch = e.touches[0];
                  setIsDragging(true);
                  setDragStart({
                    x: touch.clientX - rect.left - imagePosition.x,
                    y: touch.clientY - rect.top - imagePosition.y,
                  });
                }
                
                // Block any multitouch attempts
                if (e.touches.length >= 2) {
                  console.log('Multitouch blocked');
                  setLastTouchDistance(0);
                  setIsDragging(false);
                }
              }}
            >
              {displayImage.endsWith('.mp4') || displayImage.endsWith('.webm') || displayImage.endsWith('.mov') ? (
                <video
                  src={displayImage}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  style={{
                    transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${imageScale})`,
                    transformOrigin: 'center',
                  }}
                  draggable={false}
                />
              ) : (
                <img
                  src={displayImage}
                  alt="User Character"
                  className="w-full h-full object-cover"
                  style={{
                    transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${imageScale})`,
                    transformOrigin: 'center',
                  }}
                  draggable={false}
                />
              )}
            </div>
            
            {/* Cover Image (Middle Layer) */}
            <img
              src={`/ios-26-camera-${isDarkTheme ? 'dark' : 'light'}-cover.webp`}
              alt="Camera Cover"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              style={{ opacity: 1, zIndex: 2, borderRadius: '22.37%' }}
            />
            
            {/* Lens Image (Top Layer) */}
            <img
              src={`/ios-26-camera-${isDarkTheme ? 'dark' : 'light'}-lens.webp`}
              alt="Camera Lens"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              style={{ opacity: lensOpacity, zIndex: 3, borderRadius: '22.37%' }}
            />
          </div>
        </div>

        {/* Mobile Controls */}
        <div className={`${cardBg} ${borderColor} border-t p-4 space-y-4`}>
          {/* Upload Button */}
          <div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded ${isDarkTheme ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
            >
              <Upload size={16} />
              Upload Image/Video
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Lens Opacity: {Math.round(lensOpacity * 100)}%
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
              Zoom: {Math.round(imageScale * 100)}%
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
          {/* Theme Toggle */}
          <div>
            <button
              onClick={() => setIsDarkTheme(!isDarkTheme)}
              className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded ${isDarkTheme ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
            >
              {isDarkTheme ? <Sun size={16} /> : <Moon size={16} />}
              {isDarkTheme ? 'Switch to Light' : 'Switch to Dark'}
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setImagePosition({ x: 0, y: 0 });
                setImageScale(1);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded ${isDarkTheme ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
            >
              <RotateCcw size={16} />
              Reset
            </button>
            <button
              onClick={handleDownload}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded ${isDarkTheme ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
            >
              <Download size={16} />
              Save
            </button>
          </div>
          {isAnimatedFile && (
            <div className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'} text-center mt-2`}>
              실제로 움직이는 이미지는 첫프레임만 표시됩니다.
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-col min-h-screen">
        {/* Desktop Header */}
        <div className={`${cardBg} ${borderColor} border-b p-4 flex items-center justify-center`}>
          <h1 className="text-xl font-semibold">Meme Lens</h1>
        </div>

        {/* Desktop Content */}
        <div className="flex-1 flex">
          {/* Canvas Area */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div 
              ref={canvasRef}
              className="relative overflow-hidden canvas-container"
              style={{ 
                width: 'min(70vh, 600px)', 
                height: 'min(70vh, 600px)',
                borderRadius: '22.37%',
                touchAction: 'none',
              }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* User Image (Bottom Layer with proper clipping) */}
              <div 
                className="absolute inset-4 overflow-hidden cursor-move"
                style={{ zIndex: 1, borderRadius: '20%' }}
                onMouseDown={handleMouseDown}
                onTouchStart={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.stopImmediatePropagation();
                  
                  // Only allow single finger drag, block multitouch completely
                  if (e.touches.length === 1) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const touch = e.touches[0];
                    setIsDragging(true);
                    setDragStart({
                      x: touch.clientX - rect.left - imagePosition.x,
                      y: touch.clientY - rect.top - imagePosition.y,
                    });
                  }
                  
                  // Block any multitouch attempts
                  if (e.touches.length >= 2) {
                    setLastTouchDistance(0);
                    setIsDragging(false);
                  }
                }}
              >
                {displayImage.endsWith('.mp4') || displayImage.endsWith('.webm') || displayImage.endsWith('.mov') ? (
                  <video
                    src={displayImage}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    style={{
                      transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${imageScale})`,
                      transformOrigin: 'center',
                    }}
                    draggable={false}
                  />
                ) : (
                  <img
                    src={displayImage}
                    alt="User Character"
                    className="w-full h-full object-cover"
                    style={{
                      transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${imageScale})`,
                      transformOrigin: 'center',
                    }}
                    draggable={false}
                  />
                )}
              </div>
              
              {/* Cover Image (Middle Layer) */}
              <img
                src={`/ios-26-camera-${isDarkTheme ? 'dark' : 'light'}-cover.webp`}
                alt="Camera Cover"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                style={{ opacity: 1, zIndex: 2, borderRadius: '22.37%' }}
              />
              
              {/* Lens Image (Top Layer) */}
              <img
                src={`/ios-26-camera-${isDarkTheme ? 'dark' : 'light'}-lens.webp`}
                alt="Camera Lens"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                style={{ opacity: lensOpacity, zIndex: 3, borderRadius: '22.37%' }}
              />
            </div>
          </div>

          {/* Control Panel */}
          <div className={`w-80 ${cardBg} ${borderColor} border-l p-6`}>
            <h2 className="text-lg font-semibold mb-6">Controls</h2>
            
            {/* Upload Button */}
            <div className="mb-8">
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded ${isDarkTheme ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
              >
                <Upload size={16} />
                Upload Image/Video
              </button>
            </div>

            {/* Lens Opacity Control */}
            <div className="mb-8">
              <label className="block text-sm font-medium mb-3">
                Lens Opacity: {Math.round(lensOpacity * 100)}%
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
                Zoom: {Math.round(imageScale * 100)}%
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

            {/* Theme Toggle */}
            <div className="mb-8">
              <button
                onClick={() => setIsDarkTheme(!isDarkTheme)}
                className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded ${isDarkTheme ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
              >
                {isDarkTheme ? <Sun size={16} /> : <Moon size={16} />}
                {isDarkTheme ? 'Switch to Light' : 'Switch to Dark'}
              </button>
            </div>

            {/* Position Reset */}
            <div className="mb-8">
              <button
                onClick={() => {
                setImagePosition({ x: 0, y: 0 });
                setImageScale(1);
              }}
                className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded ${isDarkTheme ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
              >
                <RotateCcw size={16} />
                Reset Position
              </button>
            </div>

            {/* Download Button */}
            <div className="mb-8">
              <button
                onClick={handleDownload}
                className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded ${isDarkTheme ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
              >
                <Download size={16} />
                Save Image
              </button>
            </div>

            {isAnimatedFile && (
              <div className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'} text-center mb-4`}>
                실제로 움직이는 이미지는 첫프레임만 표시됩니다.
              </div>
            )}

          </div>
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
  );
}
