import React from 'react';
import { formatNumber } from './format';

type ServiceCategoryCardProps = {
  icon: string;
  label: string;
  services: number;
};

export default function ServiceCategoryCard({ icon, label, services }: ServiceCategoryCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <span className="text-2xl">{icon}</span>
      <p className="mt-3 font-semibold text-slate-900">{label}</p>
      <p className="mt-1 text-xs text-slate-500">{formatNumber(services)} services</p>
    </article>
  );
}
