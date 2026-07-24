'use client';

import React from 'react';

type DividerProps = {
  className?: string;
};

export default function Divider({ className = '' }: DividerProps) {
  return (
    <div className={[ 'my-8 h-px bg-slate-200 dark:bg-slate-700', className ].filter(Boolean).join(' ')} />
  );
}
