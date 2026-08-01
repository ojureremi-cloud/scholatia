'use client';

import type { ResearcherProfile } from '@/types/researcher';

type AcademicSkillsProps = {
  researcher: ResearcherProfile;
  className?: string;
};

const levelStyles: Record<string, string> = {
  Beginner: 'bg-slate-100 text-slate-700',
  Intermediate: 'bg-sky-100 text-sky-800',
  Advanced: 'bg-indigo-100 text-indigo-800',
  Expert: 'bg-emerald-100 text-emerald-800',
};

export default function AcademicSkills({ researcher, className = '' }: AcademicSkillsProps) {
  const { skills } = researcher;
  if (skills.length === 0) {
    return <p className={['text-sm text-slate-600', className].filter(Boolean).join(' ')}>No skills recorded.</p>;
  }
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Skills</h3>
      <ul className="mt-5 space-y-3">
        {skills.map((skill) => (
          <li key={skill.id} className="flex items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">{skill.name}</p>
              <p className="text-xs text-slate-500">{skill.category}</p>
            </div>
            <span className={['rounded-full px-2 py-0.5 text-xs font-medium', levelStyles[skill.level] ?? 'bg-slate-100 text-slate-700'].join(' ')}>
              {skill.level}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
