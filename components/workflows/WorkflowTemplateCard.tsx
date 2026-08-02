import { WorkflowBadge } from './WorkflowBadge';
import { formatNumber } from './format';
import type { WorkflowTemplate } from '@/types/workflows';

type WorkflowTemplateCardProps = {
  template: WorkflowTemplate;
};

export function WorkflowTemplateCard({ template }: WorkflowTemplateCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <WorkflowBadge kind={template.kind} />
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
          {formatNumber(template.stages.length)} stages
        </span>
      </div>
      <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-slate-100">{template.name}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{template.description}</p>
      <p className="mt-3 text-xs text-slate-400">
        Audience: <span className="font-semibold text-slate-600 dark:text-slate-300">{template.audience}</span>
      </p>
      {template.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {template.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-600 dark:bg-sky-900 dark:text-sky-300">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
