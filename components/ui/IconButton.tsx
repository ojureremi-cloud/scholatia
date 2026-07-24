'use client';

import React from 'react';

type IconButtonProps = {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  className?: string;
};

export default function IconButton({
  icon,
  label,
  onClick,
  href,
  disabled = false,
  className = '',
}: IconButtonProps) {
  const classes = [
    'inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (href) {
    return (
      <a aria-label={label} href={href} className={classes}>
        {icon}
      </a>
    );
  }

  return (
    <button type="button" disabled={disabled} onClick={onClick} className={classes} aria-label={label}>
      {icon}
    </button>
  );
}
