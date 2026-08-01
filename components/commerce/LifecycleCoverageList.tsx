import React from 'react';
import type { CommerceLifecycleCoverage } from '@/types/commerce';

type LifecycleCoverageListProps = {
  coverage: CommerceLifecycleCoverage[];
};

export default function LifecycleCoverageList({ coverage }: LifecycleCoverageListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {coverage.map((entry) => (
        <article
          key={entry.stage}
          className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="font-semibold text-slate-900">{entry.stageName}</p>
            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-800">{entry.stage}</span>
          </div>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.15em] text-slate-400">{entry.revenueStream}</p>

          <div className="mt-4 space-y-1 text-xs text-slate-500">
            {entry.surfaces.map((surface) => (
              <p key={surface} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-slate-400" />
                {surface}
              </p>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5 border-t border-slate-100 pt-3">
            {entry.exampleProductIds.map((productId) => (
              <span key={productId} className="rounded-full bg-slate-50 px-2.5 py-1 text-xs text-slate-500">
                {productId}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
