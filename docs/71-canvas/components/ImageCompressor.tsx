import React, { useState, useRef } from 'react';

interface CompressorProps {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export const ImageCompressor: React.FC<CompressorProps> = ({
  maxWidth = 800,
  maxHeight = 600,
  quality = 0.8
}) => {
  const [preview, setPreview] = useState<string>('');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      
      img.onload = () => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;

        // 计算缩放比例
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (maxWidth * height) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (maxHeight * width) / height;
          height = maxHeight;
        }

        // 设置 canvas 尺寸
        canvas.width = width;
        canvas.height = height;

        // 绘制图片
        ctx.drawImage(img, 0, 0, width, height);

        // 转换为 blob
        canvas.toBlob(
          (blob) => resolve(blob!),
          'image/jpeg',
          quality
        );

        // 释放内存
        URL.revokeObjectURL(img.src);
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOriginalSize(file.size);

    try {
      const compressedBlob = await compressImage(file);
      setCompressedSize(compressedBlob.size);
      setPreview(URL.createObjectURL(compressedBlob));
    } catch (error) {
      console.error('压缩失败:', error);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      {preview && (
        <div>
          <img src={preview} alt="压缩预览" style={{ maxWidth: '100%' }} />
          <div>
            原始大小: {(originalSize / 1024).toFixed(2)} KB
            <br />
            压缩后大小: {(compressedSize / 1024).toFixed(2)} KB
            <br />
            压缩率: {((1 - compressedSize / originalSize) * 100).toFixed(2)}%
          </div>
        </div>
      )}
    </div>
  );
}; 