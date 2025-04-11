import React from 'react';

interface ImageDownloaderProps {
  imageUrl: string;
  fileName?: string;
  children?: React.ReactNode;
  className?: string;
  alt?: string;
}

export const ImageDownloader: React.FC<ImageDownloaderProps> = ({ 
  imageUrl, 
  fileName, 
  children,
  className,
  alt
}) => {
  const downloadImage = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <div onClick={downloadImage} style={{ cursor: 'pointer' }}>
      {children}
    </div>
  );
};
