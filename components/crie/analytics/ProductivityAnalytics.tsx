import { crieProductivityModel } from '../data';
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

export function ProductivityAnalytics() {
  const model = crieProductivityModel();

  return (
    <Stack>
      <Panel eyebrow="Research analytics" title="Productivity" icon="⚡">
        <p className="mb-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Derived productivity indicators across the research lifecycle: stage coverage, writing output, learning progress, and publication pipeline.
        </p>
        <dl className="space-y-2">{NumericRows(model.lifecycleStatistics)}</dl>
      </Panel>

      <div className="grid gap-8 lg:grid-cols-3">
        <Panel eyebrow="Productivity" title="Writing" icon="✍️">
          <dl className="space-y-2">{NumericRows(model.writingStatistics)}</dl>
        </Panel>
        <Panel eyebrow="Productivity" title="Learning" icon="🎓">
          <dl className="space-y-2">{NumericRows(model.learnerStatistics)}</dl>
        </Panel>
        <Panel eyebrow="Productivity" title="Publication" icon="📰">
          <dl className="space-y-2">{NumericRows(model.publicationStatistics)}</dl>
        </Panel>
      </div>
    </Stack>
  );
}
