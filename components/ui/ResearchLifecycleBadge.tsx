import React from 'react';

type ResearchLifecycleBadgeProps = {
  phase: string;
  className?: string;
};

export function ResearchLifecycleBadge({ phase, className = '' }: ResearchLifecycleBadgeProps) {
  return (
    <span className={['inline-flex items-center justify-center rounded-full bg-slate-100 text-slate-700 text-xs font-medium px-2 py-1', className].filter(Boolean).join(' ')}>
      {phase}
    </span>
  );
}
