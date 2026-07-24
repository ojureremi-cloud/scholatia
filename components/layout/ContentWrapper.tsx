'use client';

import React from 'react';

type ContentWrapperProps = {
  className?: string;
  children: React.ReactNode;
};

export default function ContentWrapper({ className = '', children }: ContentWrapperProps) {
  return <div className={[ 'mx-auto max-w-7xl px-6', className ].filter(Boolean).join(' ')}>{children}</div>;
}
