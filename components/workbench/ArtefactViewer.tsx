import { ArtefactStatusBadge } from './WorkbenchBadges';
import { artefactTypeIcon, formatDate, formatNumber, formatRelative } from './format';
import { chapterProgress } from '@/lib/workflows';
import type { ArtefactSectionStatus, ScholarlyArtefact } from '@/types/workflows';

type ArtefactViewerProps = {
  artefact: ScholarlyArtefact;
};

export function sectionStatusVariant(status: ArtefactSectionStatus): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case 'approved':
      return 'success';
    case 'awaiting-review':
    case 'revision-submitted':
      return 'info';
    case 'revision-requested':
      return 'danger';
    case 'in-progress':
      return 'warning';
    default:
      return 'default';
  }
}

export function formatSectionStatus(status: ArtefactSectionStatus): string {
  switch (status) {
    case 'approved':
      return 'Approved';
    case 'awaiting-review':
      return 'Awaiting Review';
    case 'revision-requested':
      return 'Revision Requested';
    case 'revision-submitted':
      return 'Revision Submitted';
    case 'in-progress':
      return 'In Progress';
    default:
      return 'Draft';
  }
}

type SectionRowProps = {
  section: { id: string; title: string; status: ArtefactSectionStatus; wordCount?: number; reviewerName?: string };
};

function SectionRow({ section }: SectionRowProps) {
  return (
    <li className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800">
      <span className="text-sm text-slate-700 dark:text-slate-200">{section.title}</span>
      <span className="flex items-center gap-2 text-xs">
        {section.wordCount != null && <span className="text-slate-400">{formatNumber(section.wordCount)} w</span>}
        {section.reviewerName && <span className="text-slate-400">🔍 {section.reviewerName}</span>}
        <span className={`rounded-full px-2 py-0.5 font-bold ${sectionStatusVariant(section.status) === 'success' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' : sectionStatusVariant(section.status) === 'danger' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'}`}>
          {formatSectionStatus(section.status)}
        </span>
      </span>
    </li>
  );
}

export function ArtefactViewer({ artefact }: ArtefactViewerProps) {
  const totalWordCount = artefact.wordCount ?? artefact.chapters.reduce((sum, chapter) => sum + chapter.sections.reduce((s, section) => s + (section.wordCount ?? 0), 0), 0);

  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {artefactTypeIcon(artefact.type)} {artefact.title}
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            {formatNumber(totalWordCount)} words · created {formatDate(artefact.createdAt)} · by {artefact.ownerName}
          </p>
        </div>
        <ArtefactStatusBadge status={artefact.status} />
      </div>

      {artefact.description && (
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{artefact.description}</p>
      )}

      {artefact.promotedAt && (
        <p className="mt-3 text-xs text-emerald-600">🚀 Promoted {formatRelative(artefact.promotedAt)}</p>
      )}

      {artefact.sourceTitle && (
        <p className="mt-1 text-xs text-slate-400">Source: {artefact.sourceTitle}</p>
      )}

      <div className="mt-6 space-y-6">
        {artefact.chapters.map((chapter) => {
          const progress = chapterProgress(chapter);
          return (
            <section key={chapter.id} className="rounded-2xl border border-slate-100 p-4 dark:border-slate-800">
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {chapter.order}. {chapter.title}
                </h4>
                <span className="text-xs font-bold text-slate-400">{progress}%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${progress}%` }} />
              </div>
              {chapter.sections.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {chapter.sections.map((section) => (
                    <SectionRow key={section.id} section={section} />
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </article>
  );
}
