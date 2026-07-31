import React from 'react';
import Badge from '@/components/ui/Badge';
import { ProjectStatusBadge } from '@/components/ui/ProjectStatusBadge';
import type { ProjectEntry } from '@/constants/placeholder-profile';

export default function ProjectCard({ name, description, role, status, period, collaborators, funding }: ProjectEntry) {
  return (
    <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
        <ProjectStatusBadge status={status} />
      </div>
      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-600">
        <Badge variant="default">{role}</Badge>
        <span className="text-slate-400">•</span>
        <span>{period}</span>
      </div>
      <div className="mt-5 flex-1 border-t border-slate-100 pt-4 text-sm text-slate-500">
        <p>Collaborators: <span className="font-medium text-slate-700">{collaborators.join(', ')}</span></p>
        <p className="mt-1.5">
          Funding: <span className="font-medium text-slate-700">{funding ?? 'Funding details pending'}</span>
        </p>
      </div>
    </div>
  );
}
