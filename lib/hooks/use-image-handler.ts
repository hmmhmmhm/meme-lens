import { useState, useEffect, useRef } from 'react';

export function useImageHandler() {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [selectedExample, setSelectedExample] = useState<string | null>(null);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [imageScale, setImageScale] = useState(1);
  const [isAnimatedFile, setIsAnimatedFile] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 우선순위: 사용자 업로드 이미지 > 선택된 예시 이미지 > 기본 비디오
  const displayImage = userImage || selectedExample || '/miku-monitoring.mp4';
  const downloadImage = userImage 
    ? (isAnimatedFile ? '/miku-monitoring.webp' : userImage) 
    : selectedExample || '/miku-monitoring.webp';

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const isAnimated = file.type === 'image/gif' || file.type.startsWith('video/');
      setIsAnimatedFile(isAnimated);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserImage(e.target?.result as string);
        setSelectedExample(null); // 사용자가 업로드하면 예시 선택 해제
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExampleSelect = (examplePath: string) => {
    setSelectedExample(examplePath);
    setUserImage(null); // 예시를 선택하면 사용자 업로드 이미지 해제
    setIsAnimatedFile(false); // 예시 이미지들은 정적 이미지
    resetImagePosition(); // 위치와 스케일 초기화
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
    selectedExample,
    imagePosition,
    setImagePosition,
    imageScale,
    setImageScale,
    isAnimatedFile,
    displayImage,
    downloadImage,
    fileInputRef,
    handleImageUpload,
    handleExampleSelect,
    resetImagePosition,
  };
}