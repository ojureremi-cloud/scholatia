'use client';

import { formatResearchMetric } from '@/lib/researchers';
import type { ResearcherProfile } from '@/types/researcher';

type ResearchMetricsProps = {
  researcher: ResearcherProfile;
  className?: string;
};

export default function ResearchMetrics({ researcher, className = '' }: ResearchMetricsProps) {
  const { metrics } = researcher;
  const stats = [
    { label: 'Publications', value: formatResearchMetric(metrics.totalPublications), icon: '📄' },
    { label: 'Citations', value: formatResearchMetric(metrics.totalCitations), icon: '📖' },
    { label: 'Downloads', value: formatResearchMetric(metrics.totalDownloads), icon: '⬇️' },
    { label: 'Reads', value: formatResearchMetric(metrics.totalReads), icon: '👁️' },
    { label: 'Followers', value: formatResearchMetric(metrics.totalFollowers), icon: '👥' },
    { label: 'Collaborators', value: formatResearchMetric(metrics.totalCollaborators), icon: '🤝' },
    { label: 'Projects', value: formatResearchMetric(metrics.totalProjects), icon: '🧪' },
    { label: 'Grants', value: formatResearchMetric(metrics.totalGrants), icon: '💰' },
    { label: 'Awards', value: formatResearchMetric(metrics.totalAwards), icon: '🏆' },
    { label: 'Patents', value: formatResearchMetric(metrics.totalPatents), icon: '🧾' },
    { label: 'Datasets', value: formatResearchMetric(metrics.totalDatasets), icon: '📊' },
  ];
  return (
    <div className={['grid gap-4 sm:grid-cols-2 lg:grid-cols-4', className].filter(Boolean).join(' ')}>
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <p className="text-2xl">{stat.icon}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{stat.value}</p>
          <p className="mt-1 text-sm font-medium text-slate-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
