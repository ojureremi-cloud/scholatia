import { crieImpactModel } from '../data';
import { Panel, Stack } from '../primitives';

function NumericRows(stats: object) {
  const rows = Object.entries(stats).filter(([, value]) => typeof value === 'number');
  return rows.map(([key, value]) => (
    <div key={key} className="flex items-center justify-between gap-4 text-sm">
      <dt className="text-slate-500 dark:text-slate-400">{key}</dt>
      <dd className="font-semibold text-slate-900 dark:text-slate-100">{value as number}</dd>
    </div>
  ));
}

export function ImpactAnalytics() {
  const model = crieImpactModel();

  return (
    <Stack>
      <Panel eyebrow="Research analytics" title="Impact" icon="🌟">
        <p className="mb-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Citation, literature, and career indicators that track the reach of the researcher&apos;s work.
        </p>
        <dl className="space-y-2">{NumericRows(model.citationStatistics)}</dl>
      </Panel>

      <div className="grid gap-8 lg:grid-cols-2">
        <Panel eyebrow="Impact" title="Literature" icon="📚">
          <dl className="space-y-2">{NumericRows(model.literatureStatistics)}</dl>
        </Panel>
        <Panel eyebrow="Impact" title="Career" icon="🧭">
          <dl className="space-y-2">{NumericRows(model.careerStatistics)}</dl>
        </Panel>
      </div>
    </Stack>
  );
}
