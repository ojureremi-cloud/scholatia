import { crieEntities, crieEnterpriseModel, crieInstitutionalAssets } from '@/lib/crie/access';
import { crieInstitutionModel } from '../data';
import { CRIEStats } from '../core';
import type { CRIEStat } from '../core';
import { Panel, Stack, Chip } from '../primitives';
import { formatNumber } from '../format';

const ASSET_ICONS: Record<string, string> = {
  dataset: '🗄️',
  report: '📄',
  curriculum: '🎓',
  methodology: '🧪',
  patent: '🧬',
  'know-how': '💡',
  repository: '📚',
};

export function InstitutionsAdmin() {
  const enterprise = crieEnterpriseModel();
  if (!enterprise) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">No enterprise cognitive model is registered.</p>;
  }
  const model = crieInstitutionModel({
    entities: crieEntities(),
    enterprise,
    assets: crieInstitutionalAssets(),
  });

  const stats: CRIEStat[] = [
    { title: 'Models', value: formatNumber(model.statistics.models), icon: '🏛️' },
    { title: 'IKOS assets', value: formatNumber(model.statistics.assets), icon: '📦' },
    { title: 'Public assets', value: formatNumber(model.statistics.publicAssets), icon: '🌍' },
    { title: 'Asset kinds', value: formatNumber(Object.keys(model.statistics.byAssetKind).length), icon: '🏷️' },
  ];

  return (
    <Stack>
      <CRIEStats stats={stats} />
      <Panel eyebrow="Institution" title={model.model.id} icon="🏛️">
        <div className="flex flex-wrap gap-2">
          <Chip tone="info">{model.model.institutionId}</Chip>
        </div>
        <div className="mt-5 grid gap-6 lg:grid-cols-2">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Strategic goals</h4>
            <ul className="mt-2 space-y-1.5">
              {model.model.strategicGoals.map((goal) => (
                <li key={goal} className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  • {goal}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Strength areas</h4>
            <ul className="mt-2 space-y-1.5">
              {model.model.strengthAreas.map((area) => (
                <li key={area} className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  • {area}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Panel>

      <Panel eyebrow="IKOS" title="Institutional knowledge assets" icon="📦">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {model.assets.map((asset) => (
            <div key={asset.id} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xl" aria-hidden="true">{ASSET_ICONS[asset.assetKind] ?? '📦'}</span>
                <Chip tone={asset.accessClass === 'public' ? 'success' : 'info'}>{asset.accessClass}</Chip>
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{asset.title}</p>
              <p className="mt-1 text-xs text-slate-400">
                {asset.assetKind} · curated by {asset.curator} · {asset.consentScope.join(', ')}
              </p>
            </div>
          ))}
        </div>
      </Panel>
    </Stack>
  );
}
