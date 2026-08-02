import type { Annotation } from '@/types/annotations';

type AnnotationHighlightProps = {
  annotation: Annotation;
};

/**
 * Visual anchor for an annotation: renders the content-free location as a
 * highlight strip. The engine never stores document content, so the highlight
 * is a styled representation of the location + offsets — not copied text.
 */
export function AnnotationHighlight({ annotation }: AnnotationHighlightProps) {
  const { location } = annotation;
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
      <div className="flex items-center gap-2">
        <span>🖍️</span>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300">
          Highlight anchor
        </p>
      </div>
      <p className="mt-2 text-sm leading-6 text-amber-900 dark:text-amber-100">
        {location.sourceEntity} · {location.sourceId}
      </p>
      <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
        Target: {location.target}
        {location.sectionId ? ` · section ${location.sectionId}` : ''}
        {location.paragraphId ? ` · paragraph ${location.paragraphId}` : ''}
        {location.sentenceId ? ` · sentence ${location.sentenceId}` : ''}
        {location.startOffset !== undefined && location.endOffset !== undefined
          ? ` · characters ${location.startOffset}–${location.endOffset}`
          : ''}
      </p>
      <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
        Anchored by ID and offset only — document content is never duplicated by the engine.
      </p>
    </div>
  );
}
