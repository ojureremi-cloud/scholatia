import React from 'react';

type CardProps = {
  className?: string;
  children: React.ReactNode;
};

function Card({ className = '', children }: CardProps) {
  return (
    <div
      className={[
        'rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}

export default Card;
