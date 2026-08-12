import React from 'react';

export type GeometryType = 'line' | 'ray' | 'segment';

interface GeometrySymbolProps {
  type: GeometryType;
  points?: string;
  className?: string;
}

export function GeometrySymbol({ type, points = 'AB', className = '' }: GeometrySymbolProps) {
  return (
    <div className={`inline-flex flex-col items-center justify-center ${className}`}>
      {/* Symbol Area above the text */}
      <div className="w-full flex items-center justify-center h-4 relative mb-[-4px]">
        {type === 'line' && (
          <svg width="100%" height="16" viewBox="0 0 40 16" preserveAspectRatio="none" className="stroke-current fill-current w-12">
            <path d="M 5,8 L 35,8" strokeWidth="1.5" />
            <polygon points="5,8 10,4 10,12" />
            <polygon points="35,8 30,4 30,12" />
          </svg>
        )}
        {type === 'ray' && (
          <svg width="100%" height="16" viewBox="0 0 40 16" preserveAspectRatio="none" className="stroke-current fill-current w-12">
            <path d="M 5,8 L 35,8" strokeWidth="1.5" />
            <polygon points="35,8 30,4 30,12" />
          </svg>
        )}
        {type === 'segment' && (
          <svg width="100%" height="16" viewBox="0 0 40 16" preserveAspectRatio="none" className="stroke-current w-12">
            <path d="M 5,8 L 35,8" strokeWidth="1.5" />
          </svg>
        )}
      </div>
      {/* Points Text */}
      <span className="font-bold text-3xl tracking-widest font-serif">{points}</span>
    </div>
  );
}
