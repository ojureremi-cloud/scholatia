import React from 'react';
import TrustRecommendationCard from './TrustRecommendationCard';
import type { RecommendationEngineReport } from '@/types/trust';

type RecommendationEnginePanelProps = {
  report: RecommendationEngineReport;
};

export default function RecommendationEnginePanel({ report }: RecommendationEnginePanelProps) {
  return (
    <div>
      <div className="mb-8 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Recommendation engine</p>
        <p className="mt-3 text-base leading-8 text-slate-600">{report.summary}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {report.recommendations.map((recommendation) => (
          <TrustRecommendationCard key={recommendation.id} recommendation={recommendation} />
        ))}
      </div>
    </div>
  );
}
