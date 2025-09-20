import React from 'react';
import { Download, Upload, RotateCcw, Sun, Moon } from 'lucide-react';

interface ControlPanelProps {
  lensOpacity: number;
  setLensOpacity: (opacity: number) => void;
  imageScale: number;
  setImageScale: (scale: number) => void;
  isDarkTheme: boolean;
  setIsDarkTheme: (theme: boolean) => void;
  isAnimatedFile: boolean;
  onUploadClick: () => void;
  onReset: () => void;
  onDownload: () => void;
  isMobile?: boolean;
}

export function ControlPanel({
  lensOpacity,
  setLensOpacity,
  imageScale,
  setImageScale,
  isDarkTheme,
  setIsDarkTheme,
  isAnimatedFile,
  onUploadClick,
  onReset,
  onDownload,
  isMobile = false,
}: ControlPanelProps) {
  const cardBg = isDarkTheme ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDarkTheme ? 'border-gray-700' : 'border-gray-200';

  const buttonStyle = `${isDarkTheme ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`;

  if (isMobile) {
    return (
      <div className={`${cardBg} ${borderColor} border-t p-4 space-y-4`}>
        {/* Upload Button */}
        <div>
          <button
            onClick={onUploadClick}
            className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded ${buttonStyle}`}
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
            className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded ${buttonStyle}`}
          >
            {isDarkTheme ? <Sun size={16} /> : <Moon size={16} />}
            {isDarkTheme ? 'Switch to Light' : 'Switch to Dark'}
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onReset}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded ${buttonStyle}`}
          >
            <RotateCcw size={16} />
            Reset
          </button>
          <button
            onClick={onDownload}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded ${buttonStyle}`}
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
    );
  }

  return (
    <div className={`w-80 ${cardBg} ${borderColor} border-l p-6`}>
      <h2 className="text-lg font-semibold mb-6">Controls</h2>
      
      {/* Upload Button */}
      <div className="mb-8">
        <button
          onClick={onUploadClick}
          className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded ${buttonStyle}`}
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
          className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded ${buttonStyle}`}
        >
          {isDarkTheme ? <Sun size={16} /> : <Moon size={16} />}
          {isDarkTheme ? 'Switch to Light' : 'Switch to Dark'}
        </button>
      </div>

      {/* Position Reset */}
      <div className="mb-8">
        <button
          onClick={onReset}
          className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded ${buttonStyle}`}
        >
          <RotateCcw size={16} />
          Reset Position
        </button>
      </div>

      {/* Download Button */}
      <div className="mb-8">
        <button
          onClick={onDownload}
          className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded ${buttonStyle}`}
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
  );
}