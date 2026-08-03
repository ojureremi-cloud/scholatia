import Badge from '@/components/ui/Badge';
import { formatCategoryIcon, formatDate } from './format';
import { GroupVerificationBadge } from './GroupVerificationBadge';
import type { Group } from '@/types/groups';

type GroupAboutProps = {
  group: Group;
};

export function GroupAbout({ group }: GroupAboutProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">About</h4>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{group.description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <GroupVerificationBadge status={group.verificationStatus} />
          <Badge variant="default">🏫 {group.institution}</Badge>
          {group.institutionId && <Badge variant="default">{group.institutionId}</Badge>}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Details</h4>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-400">Department</dt>
              <dd className="font-semibold text-slate-900 dark:text-slate-100">{group.department}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-400">Country</dt>
              <dd className="font-semibold text-slate-900 dark:text-slate-100">{group.country}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-400">Discipline</dt>
              <dd className="font-semibold text-slate-900 dark:text-slate-100">{group.discipline}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-400">Created</dt>
              <dd className="font-semibold text-slate-900 dark:text-slate-100">{formatDate(group.createdAt)}</dd>
            </div>
            {group.website && (
              <div className="flex justify-between gap-4">
                <dt className="text-slate-400">Website</dt>
                <dd className="truncate font-semibold text-sky-600 dark:text-sky-400">{group.website}</dd>
              </div>
            )}
            {group.email && (
              <div className="flex justify-between gap-4">
                <dt className="text-slate-400">Email</dt>
                <dd className="truncate font-semibold text-sky-600 dark:text-sky-400">{group.email}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Research areas</h4>
          {group.researchAreas.length > 0 ? (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {group.researchAreas.map((area) => (
                <li
                  key={area}
                  className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-700 dark:bg-sky-900 dark:text-sky-300"
                >
                  {formatCategoryIcon(group.category)} {area}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate-400">No research areas listed.</p>
          )}
        </div>
      </div>

      {group.keywords.length > 0 && (
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Keywords</h4>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {group.keywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                #{keyword}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
