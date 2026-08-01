'use client';

import type { ResearcherProfile } from '@/types/researcher';

type LanguageCardProps = {
  researcher: ResearcherProfile;
  className?: string;
};

export default function LanguageCard({ researcher, className = '' }: LanguageCardProps) {
  const { languages } = researcher;
  if (languages.length === 0) {
    return <p className={['text-sm text-slate-600', className].filter(Boolean).join(' ')}>No languages recorded.</p>;
  }
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Languages</h3>
      <ul className="mt-5 space-y-3">
        {languages.map((language) => (
          <li key={language.id} className="flex items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">{language.name}</p>
              {language.description ? <p className="text-xs text-slate-500">{language.description}</p> : null}
            </div>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">{language.proficiency}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
