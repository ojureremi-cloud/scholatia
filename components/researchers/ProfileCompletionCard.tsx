'use client';

import type { ResearcherProfile } from '@/types/researcher';

type ProfileCompletionCardProps = {
  researcher: ResearcherProfile;
  className?: string;
};

export default function ProfileCompletionCard({ researcher, className = '' }: ProfileCompletionCardProps) {
  const { profileCompletion } = researcher;
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-slate-900">Profile completion</h3>
        <span className="text-3xl font-semibold text-slate-900">{profileCompletion.score}%</span>
      </div>
      <div className="mt-3 h-2 rounded-full bg-slate-100">
        <div className="h-2 rounded-full bg-sky-600" style={{ width: `${profileCompletion.score}%` }} />
      </div>
      <p className="mt-2 text-sm text-slate-600">
        {profileCompletion.completedFields} of {profileCompletion.totalFields} identity fields complete.
      </p>
      {profileCompletion.remainingFields.length > 0 ? (
        <div className="mt-4">
          <p className="text-sm font-medium text-slate-500">Remaining fields</p>
          <ul className="mt-2 space-y-1">
            {profileCompletion.remainingFields.map((field) => (
              <li key={field} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
                {field}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
          All identity fields complete.
        </p>
      )}
    </section>
  );
}
