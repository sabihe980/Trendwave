"use client";

import React from "react";

export function PostrickLogo({ 
  className = "w-8 h-8", 
  color = "#1E3216", 
  bgStrokeColor = "#E1E2DC",
  withBg = false
}: { 
  className?: string; 
  color?: string; 
  bgStrokeColor?: string;
  withBg?: boolean;
}) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {withBg && (
        <rect width="100" height="100" rx="16" fill={bgStrokeColor} />
      )}
      {/* Outer Hexagon Blocks */}
      {/* Block 0 (Top-Right Diagonal) */}
      <polygon 
        points="50,26 67.3,16 88.1,28 88.1,48 70.8,38" 
        fill={color} 
        stroke={bgStrokeColor} 
        strokeWidth="3.2" 
        strokeLinejoin="round"
      />
      {/* Block 1 (Right Vertical) */}
      <polygon 
        points="70.8,38 88.1,48 88.1,72 70.8,82 70.8,62" 
        fill={color} 
        stroke={bgStrokeColor} 
        strokeWidth="3.2" 
        strokeLinejoin="round"
      />
      {/* Block 2 (Bottom-Right Diagonal) */}
      <polygon 
        points="70.8,62 70.8,82 50,94 32.7,84 50,74" 
        fill={color} 
        stroke={bgStrokeColor} 
        strokeWidth="3.2" 
        strokeLinejoin="round"
      />
      {/* Block 3 (Bottom-Left Diagonal) */}
      <polygon 
        points="50,74 32.7,84 11.9,72 11.9,52 29.2,62" 
        fill={color} 
        stroke={bgStrokeColor} 
        strokeWidth="3.2" 
        strokeLinejoin="round"
      />
      {/* Block 4 (Left Vertical) */}
      <polygon 
        points="29.2,62 11.9,52 11.9,28 29.2,18 29.2,38" 
        fill={color} 
        stroke={bgStrokeColor} 
        strokeWidth="3.2" 
        strokeLinejoin="round"
      />
      {/* Block 5 (Top-Left Diagonal) */}
      <polygon 
        points="29.2,38 29.2,18 50,6 67.3,16 50,26" 
        fill={color} 
        stroke={bgStrokeColor} 
        strokeWidth="3.2" 
        strokeLinejoin="round"
      />

      {/* Central Cube Rhombi */}
      {/* Top Rhombus */}
      <polygon 
        points="50,50 29.2,38 50,26 70.8,38" 
        fill={color} 
        stroke={bgStrokeColor} 
        strokeWidth="3.2" 
        strokeLinejoin="round"
      />
      {/* Bottom-Left Rhombus */}
      <polygon 
        points="50,50 50,74 29.2,62 29.2,38" 
        fill={color} 
        stroke={bgStrokeColor} 
        strokeWidth="3.2" 
        strokeLinejoin="round"
      />
      {/* Bottom-Right Rhombus */}
      <polygon 
        points="50,50 70.8,38 70.8,62 50,74" 
        fill={color} 
        stroke={bgStrokeColor} 
        strokeWidth="3.2" 
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Youtube({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

export function Facebook({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

export function Instagram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

export function Linkedin({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0h.003z"/>
    </svg>
  );
}
