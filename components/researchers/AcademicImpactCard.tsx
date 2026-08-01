'use client';

import type { ResearcherProfile } from '@/types/researcher';

type AcademicImpactCardProps = {
  researcher: ResearcherProfile;
  className?: string;
};

export default function AcademicImpactCard({ researcher, className = '' }: AcademicImpactCardProps) {
  const { impact } = researcher;
  const altmetric = impact.altmetricMetrics;
  const collaboration = impact.collaborationMetrics;
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Academic impact</h3>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-3xl font-semibold text-slate-900">{impact.downloads.toLocaleString('en-US')}</p>
          <p className="mt-1 text-sm font-medium text-slate-500">Downloads</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-3xl font-semibold text-slate-900">{impact.reads.toLocaleString('en-US')}</p>
          <p className="mt-1 text-sm font-medium text-slate-500">Reads</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-3xl font-semibold text-slate-900">{altmetric.score}</p>
          <p className="mt-1 text-sm font-medium text-slate-500">Altmetric score</p>
        </div>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {[
          { label: 'Mentions', value: altmetric.mentions },
          { label: 'News', value: altmetric.news },
          { label: 'Blogs', value: altmetric.blogs },
          { label: 'Twitter', value: altmetric.twitter },
          { label: 'Facebook', value: altmetric.facebook },
          { label: 'Policy documents', value: altmetric.policy },
          { label: 'Wikipedia', value: altmetric.wikipedia },
          { label: 'Patents', value: altmetric.patents },
          { label: 'Mendeley readers', value: altmetric.mendeley },
          { label: 'Dimensions', value: altmetric.dimensions },
        ].map((stat) => (
          <div key={stat.label} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
            <span className="text-slate-600">{stat.label}</span>
            <span className="font-semibold text-slate-900">{stat.value}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-medium text-slate-500">Collaboration impact</p>
        <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">Total collaborators</dt>
            <dd className="font-semibold text-slate-900">{collaboration.totalCollaborators}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Total co-authors</dt>
            <dd className="font-semibold text-slate-900">{collaboration.totalCoAuthors}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Institutional partners</dt>
            <dd className="font-semibold text-slate-900">{collaboration.institutionalPartners}</dd>
          </div>
          <div>
            <dt className="text-slate-500">International collaborations</dt>
            <dd className="font-semibold text-slate-900">{collaboration.internationalCollaborations}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
