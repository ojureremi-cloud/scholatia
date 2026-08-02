import type { Annotation } from '@/types/annotations';
import { Badge } from '@/components/ui';

type AnnotationNavigatorProps = {
  annotations: Annotation[];
};

export function AnnotationNavigator({ annotations }: AnnotationNavigatorProps) {
  const bySource = new Map<string, Annotation[]>();
  annotations.forEach((annotation) => {
    const key = `${annotation.sourceEntity}:${annotation.sourceId}`;
    const list = bySource.get(key) ?? [];
    list.push(annotation);
    bySource.set(key, list);
  });

  const groups = [...bySource.entries()].sort(
    (a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]),
  );

  return (
    <div className="space-y-4">
      {groups.map(([key, list]) => {
        const [sourceEntity, sourceId] = key.split(':');
        return (
          <div
            key={key}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-950"
          >
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="info">{sourceEntity}</Badge>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {sourceId}
              </span>
              <span className="ml-auto text-sm font-semibold text-slate-500">
                {list.length} annotation{list.length === 1 ? '' : 's'}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {list.map((annotation) => (
                <span
                  key={annotation.id}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
                >
                  {annotation.type} · {annotation.status}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
