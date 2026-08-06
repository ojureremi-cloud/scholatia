import { crieAnalytics } from '@/lib/crie/access';
import { crieAnalyticsModel } from '../data';
import { CRIEStats } from '../core';
import type { CRIEStat } from '../core';
import { Panel, Stack, Chip } from '../primitives';
import { formatDateTime, formatNumber, formatPercent } from '../format';
import { AnalyticsScopeView } from './AnalyticsScopeView';

export function AnalyticsOverview() {
  const researcher = crieAnalytics()[0];
  if (!researcher) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">No analytics snapshots are available.</p>;
  }
  const model = crieAnalyticsModel({ researcher });

  const stats: CRIEStat[] = [
    { title: 'Researcher', value: formatNumber(model.researcher.indicators.length), icon: '🧑‍🔬' },
    { title: 'Institution', value: formatNumber(model.institution.indicators.length), icon: '🏛️' },
    { title: 'Enterprise', value: formatNumber(model.enterprise.indicators.length), icon: '🌍' },
    { title: 'Global', value: formatNumber(model.global.indicators.length), icon: '📡' },
  ];

  return (
    <Stack>
      <CRIEStats stats={stats} />
      <Panel eyebrow="Research analytics" title="Scope snapshots" icon="📈">
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <Chip tone="info">cached, never authoritative</Chip>
          <Chip>generated {formatDateTime(model.researcher.generatedAt)}</Chip>
        </div>
        <div className="space-y-6">
          <AnalyticsScopeView scopeId="Researcher" analytics={model.researcher} />
          <AnalyticsScopeView scopeId="Institution" analytics={model.institution} />
          <AnalyticsScopeView scopeId="Enterprise" analytics={model.enterprise} />
          <AnalyticsScopeView scopeId="Global ecosystem" analytics={model.global} />
        </div>
        <p className="mt-6 text-xs text-slate-400">
          Global snapshot averages {formatNumber(model.globalStats.indicators)} indicators across {formatNumber(model.globalStats.snapshots)} scopes at {formatPercent(model.globalStats.averageIndicatorValue)} average value.
        </p>
      </Panel>
    </Stack>
  );
}
