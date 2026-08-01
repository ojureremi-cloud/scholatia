'use client';

import type { ResearcherProfile } from '@/types/researcher';

type ProjectCardProps = {
  researcher: ResearcherProfile;
  className?: string;
};

export default function ProjectCard({ researcher, className = '' }: ProjectCardProps) {
  const projects = researcher.relationships.projects;
  if (projects.length === 0) {
    return <p className={['text-sm text-slate-600', className].filter(Boolean).join(' ')}>No linked projects.</p>;
  }
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Projects</h3>
      <ul className="mt-5 space-y-3">
        {projects.map((project) => (
          <li key={project.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-sm font-semibold text-slate-900">{project.title}</p>
            {project.detail ? <p className="mt-1 text-sm text-slate-600">{project.detail}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
