import Badge from '@/components/ui/Badge';
import {
  formatDate,
  formatPublicationStatus,
  formatPublicationStatusIcon,
  formatPublicationType,
  formatPublicationTypeIcon,
  publicationStatusVariant,
} from './format';
import type { Group } from '@/types/groups';

type GroupPublicationsProps = {
  group: Group;
};

export function GroupPublications({ group }: GroupPublicationsProps) {
  if (group.publications.length === 0) {
    return <p className="text-sm text-slate-400">No publications recorded for this group yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {group.publications.map((publication) => (
        <li
          key={publication.id}
          className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg">{formatPublicationTypeIcon(publication.type)}</span>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{publication.title}</p>
            <Badge variant="default">{formatPublicationType(publication.type)}</Badge>
            <Badge variant={publicationStatusVariant(publication.status)}>
              {formatPublicationStatusIcon(publication.status)} {formatPublicationStatus(publication.status)}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Authors: {publication.authors.map((author) => `@${author}`).join(', ')}
            {publication.publishedAt ? ` · published ${formatDate(publication.publishedAt)}` : ''}
          </p>
          {publication.sourceId && publication.sourceEntity && (
            <p className="mt-1 text-xs text-slate-400">
              Source: <span className="font-semibold text-slate-600 dark:text-slate-300">{publication.sourceEntity}</span>
              <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                {publication.sourceId}
              </span>
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
