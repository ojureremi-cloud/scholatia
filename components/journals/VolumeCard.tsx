'use client';

import React from 'react';
import type { VolumeSummary } from '@/types/identity';

type VolumeCardProps = {
  volume: VolumeSummary;
  className?: string;
};

export default function VolumeCard({ volume, className = '' }: VolumeCardProps) {
  return (
    <div className={['rounded-2xl border border-slate-200 bg-white p-4 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold text-slate-900">Volume {volume.volumeNumber}</p>
      <p className="mt-2 text-sm text-slate-600">{volume.year}</p>
      <p className="mt-1 text-sm text-slate-500">Status: {volume.status}</p>
    </div>
  );
}
