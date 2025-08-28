import React, { useEffect, useMemo, useState } from 'react';

type Props = {
  src: string;
  width: number;
  height: number;
  alt?: string;
  borderRadius?: number;
  background?: string;
};

export default function AutoCroppedImage({ src, width, height, alt = '', borderRadius = 8, background = '#fff' }: Props) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const { data } = imageData;

        const isBg = (r: number, g: number, b: number, a: number) => {
          if (a < 5) return true; // transparent
          // near-white background threshold
          return r > 245 && g > 245 && b > 245;
        };

        let top = canvas.height, left = canvas.width, right = 0, bottom = 0;
        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const idx = (y * canvas.width + x) * 4;
            const r = data[idx], g = data[idx + 1], b = data[idx + 2], a = data[idx + 3];
            if (!isBg(r, g, b, a)) {
              if (x < left) left = x;
              if (x > right) right = x;
              if (y < top) top = y;
              if (y > bottom) bottom = y;
            }
          }
        }

        // Fallback: if nothing detected, use a centered square crop
        if (right <= left || bottom <= top) {
          const size = Math.min(canvas.width, canvas.height);
          left = Math.floor((canvas.width - size) / 2);
          top = Math.floor((canvas.height - size) / 2);
          right = left + size;
          bottom = top + size;
        }

        const cropW = Math.max(1, right - left + 1);
        const cropH = Math.max(1, bottom - top + 1);

        const out = document.createElement('canvas');
        const octx = out.getContext('2d');
        if (!octx) return;
        out.width = width;
        out.height = height;

        // draw cropped region scaled into target
        octx.fillStyle = background;
        octx.fillRect(0, 0, out.width, out.height);
        octx.imageSmoothingEnabled = true;
        octx.imageSmoothingQuality = 'high';
        octx.drawImage(
          canvas,
          left,
          top,
          cropW,
          cropH,
          0,
          0,
          out.width,
          out.height
        );

        const url = out.toDataURL('image/png');
        if (!cancelled) setDataUrl(url);
      } catch (e) {
        // ignore and leave dataUrl null to fallback to <img src>
      }
    };
    img.onerror = () => {
      // leave dataUrl as null
    };
    img.src = src;
    return () => { cancelled = true; };
  }, [src, width, height, background]);

  if (!dataUrl) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={{ objectFit: 'contain', borderRadius, backgroundColor: '#f6fff7' }}
      />
    );
  }

  return (
    <img
      src={dataUrl}
      alt={alt}
      width={width}
      height={height}
      style={{ objectFit: 'contain', borderRadius, backgroundColor: '#f6fff7' }}
    />
  );
}
