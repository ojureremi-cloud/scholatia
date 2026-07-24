import React from 'react';

type LogoProps = {
  className?: string;
};

function Logo({ className = '' }: LogoProps) {
  return (
    <a href="#home" className={[ 'text-2xl font-semibold tracking-tight text-slate-900', className ].filter(Boolean).join(' ')}>
      Scholatia
    </a>
  );
}

export default Logo;
