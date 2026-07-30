import React from 'react';

interface RiseLogoSvgProps {
  className?: string;
  size?: number;
}

export const RiseLogoSvg: React.FC<RiseLogoSvgProps> = ({ className = 'w-10 h-10', size = 40 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} drop-shadow-xs transition-transform hover:scale-105`}
    >
      <defs>
        {/* Soft Radial Gradient background */}
        <linearGradient id="riseBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff1f2" />
          <stop offset="50%" stopColor="#fce7f3" />
          <stop offset="100%" stopColor="#f3e8ff" />
        </linearGradient>

        {/* Flower / Sun Gradient */}
        <linearGradient id="roseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="50%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>

        {/* Golden Sun Core */}
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>

        <filter id="shadowEffect" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#f43f5e" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Rounded Container Box */}
      <rect width="100" height="100" rx="28" fill="url(#riseBgGrad)" stroke="#fecdd3" strokeWidth="2" />

      {/* Stylized Rising Sun & Blooming Flower Petals */}
      <g filter="url(#shadowEffect)" transform="translate(50, 52)">
        {/* Central Blooming Heart Petals */}
        <path
          d="M 0 -24 C 14 -38, 30 -14, 0 16 C -30 -14, -14 -38, 0 -24 Z"
          fill="url(#roseGrad)"
        />
        
        {/* Left Wing Petal */}
        <path
          d="M 0 0 C -22 -20, -38 4, -10 16 Z"
          fill="#f43f5e"
          opacity="0.85"
        />

        {/* Right Wing Petal */}
        <path
          d="M 0 0 C 22 -20, 38 4, 10 16 Z"
          fill="#ec4899"
          opacity="0.85"
        />

        {/* Bottom Support Leaves (Rise Foundation) */}
        <path
          d="M -24 6 C -12 22, 12 22, 24 6 C 14 26, -14 26, -24 6 Z"
          fill="#a855f7"
          opacity="0.75"
        />

        {/* Golden Core Sparkle */}
        <circle cx="0" cy="-6" r="6" fill="url(#goldGrad)" />
        <circle cx="0" cy="-6" r="2.5" fill="#ffffff" />
      </g>
    </svg>
  );
};
