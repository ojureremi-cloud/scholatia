'use client';

import type { ResearcherStatistics } from '@/types/researcher';

type AcademicStatisticsProps = {
  statistics: ResearcherStatistics;
  className?: string;
};

export default function AcademicStatistics({ statistics, className = '' }: AcademicStatisticsProps) {
  const stats = [
    { label: 'Researchers', value: statistics.totalResearchers, icon: '🧑‍🔬' },
    { label: 'Countries', value: statistics.totalCountries, icon: '🌍' },
    { label: 'Institutions', value: statistics.totalInstitutions, icon: '🏛️' },
    { label: 'Disciplines', value: statistics.totalDisciplines, icon: '📚' },
    { label: 'Publications', value: statistics.totalPublications.toLocaleString('en-US'), icon: '📄' },
    { label: 'Citations', value: statistics.totalCitations.toLocaleString('en-US'), icon: '📖' },
    { label: 'Projects', value: statistics.totalProjects, icon: '🧪' },
    { label: 'Datasets', value: statistics.totalDatasets, icon: '📊' },
    { label: 'Verified researchers', value: statistics.verifiedResearchers, icon: '✅' },
    { label: 'Average trust score', value: `${statistics.avgTrustScore}/100`, icon: '⭐' },
    { label: 'Followers', value: statistics.totalFollowers.toLocaleString('en-US'), icon: '👥' },
    { label: 'Collaborators', value: statistics.totalCollaborators.toLocaleString('en-US'), icon: '🤝' },
  ];
  return (
    <div className={['grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className].filter(Boolean).join(' ')}>
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{stat.icon}</span>
            <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
          </div>
          <p className="mt-1 text-sm font-medium text-slate-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
