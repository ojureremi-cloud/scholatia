import Badge from '@/components/ui/Badge';
import {
  formatDate,
  formatProjectStatus,
  formatProjectStatusIcon,
  projectStatusVariant,
} from './format';
import type { Group } from '@/types/groups';

type GroupProjectsProps = {
  group: Group;
};

export function GroupProjects({ group }: GroupProjectsProps) {
  if (group.projects.length === 0) {
    return <p className="text-sm text-slate-400">No projects running under this group.</p>;
  }

  return (
    <ul className="space-y-3">
      {group.projects.map((project) => (
        <li
          key={project.id}
          className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg">{formatProjectStatusIcon(project.status)}</span>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{project.title}</p>
            <Badge variant={projectStatusVariant(project.status)}>
              {formatProjectStatus(project.status)}
            </Badge>
          </div>
          {project.description && (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{project.description}</p>
          )}
          <p className="mt-1 text-xs text-slate-400">
            {project.members.length > 0 ? `Members: ${project.members.map((username) => `@${username}`).join(', ')}` : 'No members assigned'}
            {project.startedAt ? ` · started ${formatDate(project.startedAt)}` : ''}
            {project.updatedAt ? ` · updated ${formatDate(project.updatedAt)}` : ''}
          </p>
          {project.sourceId && project.sourceEntity && (
            <p className="mt-1 text-xs text-slate-400">
              Source: <span className="font-semibold text-slate-600 dark:text-slate-300">{project.sourceEntity}</span>
              <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                {project.sourceId}
              </span>
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
