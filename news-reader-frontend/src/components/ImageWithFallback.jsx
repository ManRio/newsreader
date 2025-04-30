'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function ImageWithFallback({ src, alt = 'Avatar', ...props }) {
  const fallbackSrc = '/default.png';
  const [imgSrc, setImgSrc] = useState(fallbackSrc);

  useEffect(() => {
    // Valida que el src sea una cadena no vacía y no igual a "/"
    if (typeof src === 'string' && src.trim() && src !== '/') {
      setImgSrc(src);
    } else {
      setImgSrc(fallbackSrc);
    }
  }, [src]);

  return (
    <Image
      src={
        imgSrc.startsWith('http') ? imgSrc : `http://localhost:5000${imgSrc}`
      }
      alt={alt}
      onError={() => setImgSrc(fallbackSrc)}
      unoptimized // ← desactiva optimización para evitar errores en desarrollo
      {...props}
    />
  );
}
