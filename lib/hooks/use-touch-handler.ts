import { useState } from 'react';

export function useTouchHandler(
  imagePosition: { x: number; y: number },
  setImagePosition: (pos: { x: number; y: number }) => void,
  imageScale: number,
  setImageScale: (scale: number) => void
) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

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

  const handleTouchMove = (e: React.TouchEvent) => {
    try {
      e.preventDefault();
      e.stopPropagation();
    } catch (error) {
      console.log('Touch event prevention failed:', error);
    }
    
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
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    try {
      e.preventDefault();
      e.stopPropagation();
    } catch (error) {
      console.log('Touch event prevention failed:', error);
    }
    
    if (e.touches.length === 0) {
      setIsDragging(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    try {
      e.preventDefault();
      e.stopPropagation();
    } catch (error) {
      console.log('Touch event prevention failed:', error);
    }
    
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
      setIsDragging(false);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    try {
      e.preventDefault();
      e.stopPropagation();
    } catch (error) {
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

  return {
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleTouchEnd,
    handleTouchStart,
    handleWheel,
  };
}