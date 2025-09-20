export const downloadCanvas = async (
  downloadImage: string,
  isDarkTheme: boolean,
  imagePosition: { x: number; y: number },
  imageScale: number,
  lensOpacity: number,
  canvasRef: React.RefObject<HTMLDivElement | null>
) => {
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