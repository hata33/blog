import React from 'react';

export const RectExample = () => (
  <svg width="200" height="200">
    <rect 
      x="10" 
      y="10" 
      width="100" 
      height="50"
      rx="5" 
      ry="5" 
      fill="blue"
      stroke="black"
      stroke-width="2"
    />
  </svg>
);

export const CircleExample = () => (
  <svg width="200" height="200">
    <circle 
      cx="100" 
      cy="100" 
      r="50"
      fill="red"
      stroke="black"
      stroke-width="2"
    />
  </svg>
);

export const PathExample = () => (
  <svg width="200" height="200">
    <path 
      d="M 10 10 L 90 90 L 90 10 Z"
      fill="none"
      stroke="black"
      stroke-width="2"
    />
  </svg>
);

export const GradientExample = () => (
  <svg width="200" height="200">
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: 'rgb(255,0,0)', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: 'rgb(0,0,255)', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect 
      x="10" 
      y="10" 
      width="180" 
      height="180" 
      fill="url(#gradient)"
    />
  </svg>
);

export const AnimationExample = () => (
  <svg width="200" height="200">
    <circle cx="100" cy="100" r="50" fill="red">
      <animate 
        attributeName="r"
        values="50;80;50"
        dur="2s"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
); 