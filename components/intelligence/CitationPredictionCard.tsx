import React from 'react';
import { ConfidenceBadge } from './IntelligenceBadge';
import { formatCompactNumber, formatNumber } from './format';
import type { CitationPrediction, CitationPredictionPoint } from '@/types/intelligence';

function sparkline(points: CitationPredictionPoint[]): string {
  if (points.length < 2) return '';
  const width = 220;
  const height = 60;
  const values = points.map((point) => point.citations);
  const max = Math.max(1, ...values);
  const min = Math.min(...values);
  const span = Math.max(1, max - min);
  const step = width / (points.length - 1);
  const coords = points.map((point, index) => {
    const x = index * step;
    const y = height - ((point.citations - min) / span) * (height - 8) - 4;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return coords.join(' ');
}

type CitationPredictionCardProps = {
  prediction: CitationPrediction;
};

export default function CitationPredictionCard({ prediction }: CitationPredictionCardProps) {
  const polyline = sparkline(prediction.dataPoints);
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {prediction.entityType}
        </span>
        <ConfidenceBadge confidence={prediction.confidence} />
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-7 text-slate-900">
        <a href={prediction.url} className="transition hover:text-sky-700">
          {prediction.target}
        </a>
      </h3>
      <p className="mt-1 text-xs font-medium text-slate-400">
        {prediction.sourceId} · {prediction.horizonMonths}-month horizon
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Current</p>
          <p className="mt-1 text-2xl font-semibold text-slate-800">{formatCompactNumber(prediction.currentCitations)}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Projected</p>
          <p className="mt-1 text-2xl font-semibold text-sky-700">{formatCompactNumber(prediction.projectedCitations)}</p>
        </div>
      </div>
      {polyline ? (
        <svg viewBox="0 0 220 60" className="mt-4 h-auto w-full" role="img" aria-label="Citation projection curve">
          <polyline
            points={polyline}
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {prediction.dataPoints.map((point, index) => (
            <circle
              key={`${point.year}-${index}`}
              cx={(index * 220) / (prediction.dataPoints.length - 1)}
              cy={60 - ((point.citations - Math.min(...prediction.dataPoints.map((p) => p.citations))) /
                Math.max(1, Math.max(...prediction.dataPoints.map((p) => p.citations)) - Math.min(...prediction.dataPoints.map((p) => p.citations)))) *
                (60 - 8) - 4}
              r={point.predicted ? 3.5 : 2.5}
              fill={point.predicted ? '#0ea5e9' : '#94a3b8'}
            />
          ))}
        </svg>
      ) : null}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span className="font-semibold text-emerald-600">+{prediction.growthRate}% projected growth</span>
        <span>{formatNumber(prediction.projectedCitations)} by {prediction.projectionDate}</span>
      </div>
    </article>
  );
}
