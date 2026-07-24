'use client';

import React from 'react';

type AvatarProps = {
  name: string;
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizeMap = {
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-14 w-14 text-lg',
};

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export default function Avatar({ name, imageUrl, size = 'md', className = '' }: AvatarProps) {
  return imageUrl ? (
    <img
      className={[ 'rounded-full object-cover', sizeMap[size], className ].filter(Boolean).join(' ')}
      src={imageUrl}
      alt={name}
    />
  ) : (
    <div className={[ 'inline-flex items-center justify-center rounded-full bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100', sizeMap[size], className ].filter(Boolean).join(' ')}>
      {getInitials(name)}
    </div>
  );
}
