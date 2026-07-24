'use client';

import React from 'react';

type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizeMap = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
};

export default function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  return (
    <div className={[ 'inline-flex animate-spin items-center justify-center rounded-full border-2 border-slate-200 border-t-slate-900', sizeMap[size], className ].filter(Boolean).join(' ')} aria-label="Loading">
      <span className="sr-only">Loading</span>
    </div>
  );
}
