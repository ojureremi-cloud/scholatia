import React from 'react';

type ContainerProps = {
  className?: string;
  children: React.ReactNode;
};

function Container({ className = '', children }: ContainerProps) {
  return <div className={[ 'mx-auto max-w-7xl px-6', className ].filter(Boolean).join(' ')}>{children}</div>;
}

export default Container;
