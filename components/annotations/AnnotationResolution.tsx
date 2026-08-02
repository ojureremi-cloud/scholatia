import type { Annotation } from '@/types/annotations';
import { AnnotationDecisionBadge } from './AnnotationBadges';
import { formatRelative } from './format';

type AnnotationResolutionProps = {
  annotations: Annotation[];
};

export function AnnotationResolution({ annotations }: AnnotationResolutionProps) {
  const resolved = annotations.filter(
    (annotation) => annotation.resolutions.length > 0 || annotation.decision,
  );

  if (resolved.length === 0) {
    return <p className="text-sm text-slate-500">No resolved annotations yet.</p>;
  }

  return (
    <div className="space-y-4">
      {resolved.map((annotation) => {
        const resolution = annotation.resolutions[annotation.resolutions.length - 1];
        return (
          <div
            key={annotation.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-950"
          >
            <div className="flex flex-wrap items-center gap-2">
              {annotation.decision ? (
                <AnnotationDecisionBadge decision={annotation.decision} />
              ) : null}
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {annotation.title ?? 'Annotation'}
              </span>
              <span className="ml-auto text-xs text-slate-500">
                {formatRelative(resolution?.at ?? annotation.updatedAt)}
              </span>
            </div>
            {resolution ? (
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Decided by <span className="font-semibold">{resolution.resolvedByName}</span>
                {resolution.comment ? ` — “${resolution.comment}”` : ''}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
