import { Badge } from '@/components/ui';
import type { AnnotationLocation } from '@/types/annotations';
import { locationBreadcrumb } from '@/lib/annotations';
import { formatLocation, formatLocationTarget } from './format';

type AnnotationLocationBadgeProps = {
  location: AnnotationLocation;
};

export function AnnotationLocationBadge({ location }: AnnotationLocationBadgeProps) {
  const breadcrumb = locationBreadcrumb(location);
  const label = breadcrumb.length > 0 ? breadcrumb.join(' › ') : formatLocationTarget(location.target);
  return <Badge variant="info">{label}</Badge>;
}

type AnnotationLocationProps = {
  location: AnnotationLocation;
};

export function AnnotationLocation({ location }: AnnotationLocationProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-slate-900">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Location</p>
      <p className="mt-2 font-medium text-slate-900 dark:text-slate-100">
        {location.sourceEntity} · {location.sourceId}
      </p>
      <p className="mt-1 text-slate-600 dark:text-slate-400">{formatLocation(location)}</p>
      {location.startOffset !== undefined && location.endOffset !== undefined ? (
        <p className="mt-1 text-xs text-slate-500">
          Characters {location.startOffset}–{location.endOffset} (content-free, by offset only)
        </p>
      ) : null}
    </div>
  );
}
