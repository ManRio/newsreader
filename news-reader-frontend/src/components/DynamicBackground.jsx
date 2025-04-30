'use client';
import { useEffect, useState } from 'react';

export default function DynamicBackground() {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    const generated = Array.from({ length: 12 }, () => ({
      x1: Math.random() * 100,
      y1: Math.random() * 100,
      x2: Math.random() * 100,
      y2: Math.random() * 100,
      duration: Math.random() * 10 + 10, // 10–20s
      delay: Math.random() * 5, // 0–5s
    }));
    setLines(generated);
  }, []);

  return (
    <svg
      className='absolute w-full h-full z-0 pointer-events-none'
      viewBox='0 0 100 100'
      preserveAspectRatio='none'
    >
      <defs>
        <linearGradient id='techLine' x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' stopColor='#00ffff' stopOpacity='0.1' />
          <stop offset='100%' stopColor='#ffffff' stopOpacity='0.05' />
        </linearGradient>
      </defs>

      {lines.map((line, i) => (
        <line
          key={i}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke='url(#techLine)'
          strokeWidth='0.2'
        >
          <animate
            attributeName='x1'
            values={`${line.x1};${line.x1 + 5};${line.x1}`}
            dur={`${line.duration}s`}
            repeatCount='indefinite'
            begin={`${line.delay}s`}
          />
          <animate
            attributeName='y1'
            values={`${line.y1};${line.y1 + 5};${line.y1}`}
            dur={`${line.duration}s`}
            repeatCount='indefinite'
            begin={`${line.delay}s`}
          />
        </line>
      ))}
    </svg>
  );
}
