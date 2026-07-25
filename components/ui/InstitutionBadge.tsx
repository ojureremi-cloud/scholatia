'use client';

import type { InstitutionType } from '@/types/identity';
import Badge from './Badge';

type InstitutionBadgeProps = {
  name: string;
  type: InstitutionType;
  className?: string;
};

export default function InstitutionBadge({ name, type, className = '' }: InstitutionBadgeProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm', className].filter(Boolean).join(' ')}>
      <p className="font-semibold text-slate-900">Institution type</p>
      <p className="mt-1 text-sm text-slate-600">{name}</p>
      <div className="mt-3">
        <Badge variant="info">{type}</Badge>
      </div>
    </div>
  );
}
