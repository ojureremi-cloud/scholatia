import type { AnalyticsIndicator } from '@/types/crie';
import { ProgressBar, Chip } from '../primitives';
import { confidenceTone, formatPercent } from '../format';

type IndicatorGridProps = {
  indicators: AnalyticsIndicator[];
};

const INDICATOR_LABELS: Record<string, string> = {
  publicationCount: 'Publications',
  citationCount: 'Citations',
  hIndex: 'h-index',
  collaborationCount: 'Collaborations',
  fundingTotal: 'Funding',
  grantSuccessRate: 'Grant success rate',
  timeInStage: 'Time in stage',
  stageAdvanceRate: 'Stage advance rate',
  contradictionCount: 'Contradictions',
  retractionCount: 'Retractions',
  openAccessRate: 'Open access rate',
  mentorshipActive: 'Active mentorship',
  innovationScore: 'Innovation score',
  expertiseMatch: 'Expertise match',
  impactScore: 'Impact score',
};

export function IndicatorGrid({ indicators }: IndicatorGridProps) {
  if (indicators.length === 0) {
    return <p className="py-4 text-center text-sm text-slate-500 dark:text-slate-400">No indicators available.</p>;
  }
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {indicators.map((indicator) => (
        <div key={indicator.key} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-3">
            <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
              {INDICATOR_LABELS[indicator.key] ?? indicator.key}
            </p>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{formatPercent(indicator.value)}</span>
          </div>
          <div className="mt-2">
            <ProgressBar percent={indicator.value * 100} label={`${INDICATOR_LABELS[indicator.key] ?? indicator.key} value`} />
          </div>
          <div className="mt-2 flex items-center justify-between gap-2 text-xs text-slate-400">
            <Chip tone={confidenceTone(indicator.confidence)}>{formatPercent(indicator.confidence.value)} conf</Chip>
            <span>v{indicator.evidenceVersion}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
