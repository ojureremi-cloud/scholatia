'use client';

import type { ResearcherProfile } from '@/types/researcher';

type ResearchPortfolioProps = {
  researcher: ResearcherProfile;
  className?: string;
};

export default function ResearchPortfolio({ researcher, className = '' }: ResearchPortfolioProps) {
  const { portfolio } = researcher;
  const stats = [
    { label: 'Total projects', value: portfolio.totalProjects },
    { label: 'Active projects', value: portfolio.activeProjects },
    { label: 'Completed projects', value: portfolio.completedProjects },
    { label: 'Datasets', value: portfolio.totalDatasets },
    { label: 'Manuscripts', value: portfolio.totalManuscripts },
    { label: 'Journal articles', value: portfolio.journalArticles },
    { label: 'Conference papers', value: portfolio.conferencePapers },
    { label: 'Books', value: portfolio.books },
    { label: 'Book chapters', value: portfolio.bookChapters },
    { label: 'Preprints', value: portfolio.preprints },
    { label: 'Technical reports', value: portfolio.technicalReports },
    { label: 'Patents', value: portfolio.totalPatents },
    { label: 'Software', value: portfolio.software },
    { label: 'Teaching courses', value: portfolio.teachingCourses },
    { label: 'Supervised students', value: portfolio.supervisedStudents },
  ];
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Research portfolio</h3>
      <p className="mt-1 text-sm text-slate-600">Outputs, projects, and teaching across the researcher record.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
            <p className="mt-1 text-sm font-medium text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
