import type { AnalyticsRollup, ResearchAnalytics } from '@/types/crie';
import { IndicatorGrid } from './IndicatorGrid';

type AnalyticsScopeViewProps = {
  scopeId: string;
  analytics: ResearchAnalytics | AnalyticsRollup;
};

export function AnalyticsScopeView({ scopeId, analytics }: AnalyticsScopeViewProps) {
  return (
    <section aria-label={`${scopeId} analytics`} className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{scopeId}</h3>
        <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
          {analytics.scope}
        </span>
      </div>
      <IndicatorGrid indicators={analytics.indicators} />
    </section>
  );
}
