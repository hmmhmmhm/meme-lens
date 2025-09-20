import { useEffect } from 'react';

export function useZoomPrevention(imageScale: number, setImageScale: (scale: number) => void) {
  useEffect(() => {
    const preventZoom = (e: TouchEvent) => {
      // Block all multitouch everywhere to prevent page zoom
      if (e.touches.length > 1) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    const preventGesture = (e: Event) => {
      // Always prevent gestures - they can trigger page zoom
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const preventWheel = (e: WheelEvent) => {
      // Block Ctrl/Cmd + wheel everywhere to prevent page zoom
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    const preventKeyZoom = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '0' || e.key === '=')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

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
    
    // Add non-passive wheel listener for canvas areas
    document.addEventListener('wheel', canvasWheelHandler, { passive: false, capture: true });
    
    // Also add to window
    window.addEventListener('touchstart', preventZoom, options);
    window.addEventListener('touchmove', preventZoom, options);
    window.addEventListener('touchend', preventZoom, options);
    window.addEventListener('gesturestart', preventGesture, options);
    window.addEventListener('gesturechange', preventGesture, options);
    window.addEventListener('gestureend', preventGesture, options);
    window.addEventListener('wheel', preventWheel, options);
    window.addEventListener('keydown', preventKeyZoom, options);

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
  }, [imageScale, setImageScale]);
}