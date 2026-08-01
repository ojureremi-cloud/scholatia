'use client';

import React from 'react';
import type { FundingLifecycleCoverage as FundingLifecycleCoverageData } from '@/types/funding';

type FundingLifecycleCardProps = {
  coverage: FundingLifecycleCoverageData[];
  className?: string;
};

export default function FundingLifecycleCard({ coverage, className = '' }: FundingLifecycleCardProps) {
  const fundingStage = coverage.find((item) => item.stageId === 'funding');
  return (
    <div className={[ 'space-y-6', className ].filter(Boolean).join(' ')}>
      {fundingStage ? (
        <div className="rounded-3xl border-2 border-emerald-500/40 bg-emerald-50/60 p-6 shadow-card">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{fundingStage.icon}</span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Current stage</p>
                <h3 className="text-2xl font-semibold text-slate-900">{fundingStage.name}</h3>
              </div>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
              Stage {fundingStage.order} of {coverage.length}
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-700">{fundingStage.description}</p>
          <div className="mt-4 h-2.5 rounded-full bg-white">
            <div
              className="h-2.5 rounded-full bg-emerald-500"
              style={{ width: `${fundingStage.completionPercentage}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-emerald-800">{fundingStage.completionPercentage}% lifecycle complete</p>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-2xl bg-white px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Previous stage</p>
              <p className="mt-1 font-medium text-slate-900">{fundingStage.previousStage ?? 'First stage'}</p>
            </div>
            <div className="rounded-2xl bg-white px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Next stage</p>
              <p className="mt-1 font-medium text-slate-900">{fundingStage.nextStage ?? 'Final stage'}</p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Lifecycle</p>
        <h3 className="mt-3 text-xl font-semibold text-slate-900">Research lifecycle coverage</h3>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {coverage.map((item) => (
            <div
              key={item.stageId}
              className={[
                'rounded-2xl border p-4',
                item.stageId === 'funding'
                  ? 'border-emerald-300 bg-emerald-50'
                  : 'border-slate-100 bg-slate-50',
              ].join(' ')}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-lg">{item.icon}</span>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-600">
                  {item.order}/{coverage.length}
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-900">{item.name}</p>
              <div className="mt-2 h-1.5 rounded-full bg-white">
                <div
                  className={item.stageId === 'funding' ? 'h-1.5 rounded-full bg-emerald-500' : 'h-1.5 rounded-full bg-sky-600'}
                  style={{ width: `${item.completionPercentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
