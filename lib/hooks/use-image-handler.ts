import { useState, useEffect, useRef } from 'react';

export function useImageHandler() {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [imageScale, setImageScale] = useState(1);
  const [isAnimatedFile, setIsAnimatedFile] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayImage = userImage || '/miku-monitoring.mp4';
  const downloadImage = userImage ? (isAnimatedFile ? '/miku-monitoring.webp' : userImage) : '/miku-monitoring.webp';

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const isAnimated = file.type === 'image/gif' || file.type.startsWith('video/');
      setIsAnimatedFile(isAnimated);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetImagePosition = () => {
    setImagePosition({ x: 0, y: 0 });
    setImageScale(1);
  };

  // Set animated file flag based on default or user image
  useEffect(() => {
    if (!userImage) {
      setIsAnimatedFile(true); // Default mp4 is animated
    }
  }, [userImage]);

  return {
    userImage,
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
  };
}