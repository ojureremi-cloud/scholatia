import React from 'react';
import Badge from '@/components/ui/Badge';
import { ProjectStatusBadge } from '@/components/ui/ProjectStatusBadge';
import type { WorkspaceProject } from '@/constants/placeholder-research';

type WorkspaceProjectCardProps = {
  project: WorkspaceProject;
};

export function WorkspaceProjectCard({ project }: WorkspaceProjectCardProps) {
  return (
    <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <Badge variant="info">{project.category}</Badge>
          <h3 className="mt-3 text-lg font-semibold text-slate-900">{project.name}</h3>
        </div>
        <ProjectStatusBadge status={project.status} />
      </div>
      <p className="mt-3 text-sm leading-7 text-slate-600">{project.description}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-600">
        <Badge variant="default">{project.role}</Badge>
        <span className="text-slate-400">•</span>
        <span>{project.period}</span>
      </div>
      <div className="mt-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Progress</span>
          <span className="font-semibold text-slate-900">{project.progress}%</span>
        </div>
        <div className="mt-2 h-2.5 rounded-full bg-slate-100">
          <div
            className="h-2.5 rounded-full bg-sky-600"
            style={{ width: `${project.progress}%` }}
            role="progressbar"
            aria-valuenow={project.progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${project.name} progress`}
          />
        </div>
      </div>
      <div className="mt-5 flex-1 border-t border-slate-100 pt-4 text-sm text-slate-500">
        <p>
          Collaborators: <span className="font-medium text-slate-700">{project.collaborators.join(', ')}</span>
        </p>
        {project.fundingSource ? (
          <p className="mt-1.5">
            Funding: <span className="font-medium text-slate-700">{project.fundingSource}</span>
            {project.fundingAmount ? <span className="font-medium text-slate-700"> · {project.fundingAmount}</span> : null}
          </p>
        ) : null}
      </div>
    </div>
  );
}
