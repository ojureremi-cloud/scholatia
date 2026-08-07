import { crieAnalytics } from '@/lib/crie/access';
import {
  analyticsIntelligenceStatistics,
  indicatorsFromAnalytics,
  risingIndicators,
  strongestIndicators,
} from '@/lib/crie/analytics-intelligence';
import { Panel, Chip, ConfidenceMeter } from '../primitives';
import { formatDateTime, formatPercent } from '../format';

export function IntelligenceAnalytics() {
  const analyticsList = crieAnalytics();
  const latest = analyticsList[analyticsList.length - 1];
  if (!latest) {
    return (
      <Panel eyebrow="Intelligence indicators" title="Derived analytics intelligence" icon="🪄">
        <p className="text-sm text-slate-500 dark:text-slate-400">No analytics snapshots are available.</p>
      </Panel>
    );
  }
  const previous = analyticsList.length > 1 ? analyticsList[analyticsList.length - 2] : undefined;
  const indicators = indicatorsFromAnalytics(latest, previous);
  const strongest = strongestIndicators(indicators, 5);
  const rising = risingIndicators(indicators);
  const statistics = analyticsIntelligenceStatistics(indicators);

  return (
    <Panel eyebrow="Intelligence indicators" title="Derived analytics intelligence" icon="🪄">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Chip tone="info">derived, never authoritative</Chip>
        <Chip>{formatDateTime(latest.generatedAt)}</Chip>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {strongest.map((indicator) => (
          <div key={indicator.key} className="rounded-[1.25rem] border border-slate-200 p-4 dark:border-slate-700">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{indicator.label}</p>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{formatPercent(indicator.value)}</span>
            </div>
            <div className="mt-2">
              <ConfidenceMeter confidence={indicator.confidence} />
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {indicator.change === 0 ? 'steady' : indicator.change > 0 ? `+${formatPercent(indicator.change)} vs previous` : `${formatPercent(indicator.change)} vs previous`} · evidence v{indicator.evidenceVersion}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Chip tone="success">{statistics.rising} rising</Chip>
        <Chip>{statistics.indicators} indicators</Chip>
        <Chip>{formatPercent(statistics.averageValue)} average</Chip>
      </div>
      {rising.length > 0 ? (
        <p className="mt-3 text-xs text-slate-400">
          Rising: {rising.map((indicator) => indicator.label).join(', ')}.
        </p>
      ) : null}
    </Panel>
  );
}
