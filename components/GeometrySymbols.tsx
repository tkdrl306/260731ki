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

export type VisualGeometryType = 'line' | 'ray' | 'ray-reverse' | 'segment';

interface GeometryPictureProps {
  type: VisualGeometryType;
  points: [string, string];
  className?: string;
}

export function GeometryPicture({ type, points, className = '' }: GeometryPictureProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg width="240" height="120" viewBox="0 0 240 120" className="stroke-indigo-600 fill-indigo-600">
        {/* Defs for arrowheads */}
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
        </defs>
        
        {/* The line */}
        {type === 'line' && (
          <line x1="20" y1="60" x2="220" y2="60" strokeWidth="4" markerStart="url(#arrow)" markerEnd="url(#arrow)" strokeLinecap="round" />
        )}
        {type === 'ray' && (
          <line x1="70" y1="60" x2="220" y2="60" strokeWidth="4" markerEnd="url(#arrow)" strokeLinecap="round" />
        )}
        {type === 'ray-reverse' && (
          <line x1="170" y1="60" x2="20" y2="60" strokeWidth="4" markerEnd="url(#arrow)" strokeLinecap="round" />
        )}
        {type === 'segment' && (
          <line x1="70" y1="60" x2="170" y2="60" strokeWidth="4" strokeLinecap="round" />
        )}

        {/* The points */}
        <circle cx="70" cy="60" r="5" className="fill-purple-700 stroke-none" />
        <circle cx="170" cy="60" r="5" className="fill-purple-700 stroke-none" />
        
        {/* Point labels */}
        <text x="70" y="90" fontSize="24" fontWeight="bold" textAnchor="middle" className="fill-slate-800 stroke-none font-serif">{points[0]}</text>
        <text x="170" y="90" fontSize="24" fontWeight="bold" textAnchor="middle" className="fill-slate-800 stroke-none font-serif">{points[1]}</text>
      </svg>
    </div>
  );
}
