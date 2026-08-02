'use client';

import type { Annotation, AnnotationDecision } from '@/types/annotations';
import { Badge, Button } from '@/components/ui';
import {
  AnnotationDecisionBadge,
  AnnotationStatusBadge,
} from './AnnotationBadges';
import { formatRelative } from './format';

type AnnotationSuggestionProps = {
  annotations: Annotation[];
  onDecide?: (id: string, decision: AnnotationDecision, comment?: string) => void;
};

const SUGGESTION_COMMENT_TYPES = new Set([
  'suggested-correction',
  'required-correction',
  'recommendation',
  'minor-revision',
  'major-revision',
]);

const DECISIONS: { decision: AnnotationDecision; label: string }[] = [
  { decision: 'accept-suggestion', label: 'Accept' },
  { decision: 'reject-suggestion', label: 'Reject' },
  { decision: 'accept-partially', label: 'Partially' },
  { decision: 'needs-discussion', label: 'Discuss' },
  { decision: 'escalate', label: 'Escalate' },
];

export function AnnotationSuggestion({ annotations, onDecide }: AnnotationSuggestionProps) {
  const suggestions = annotations.filter((annotation) =>
    SUGGESTION_COMMENT_TYPES.has(annotation.commentType),
  );

  if (suggestions.length === 0) {
    return <p className="text-sm text-slate-500">No open suggestions.</p>;
  }

  return (
    <div className="space-y-4">
      {suggestions.map((annotation) => (
        <div
          key={annotation.id}
          className="rounded-2xl border border-sky-200 bg-sky-50 p-4 dark:border-sky-800 dark:bg-sky-950"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="info">💡 suggestion</Badge>
            <AnnotationStatusBadge status={annotation.status} />
            {annotation.decision ? (
              <AnnotationDecisionBadge decision={annotation.decision} />
            ) : null}
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            {annotation.title ?? 'Suggestion'}
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-300">
            {annotation.body}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            {annotation.authorName} · {formatRelative(annotation.createdAt)} ·{' '}
            {annotation.location.sourceId}
          </p>
          {onDecide && annotation.status === 'open' ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {DECISIONS.map(({ decision, label }) => (
                <Button
                  key={decision}
                  variant="outline"
                  size="sm"
                  onClick={() => onDecide(annotation.id, decision)}
                >
                  {label}
                </Button>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
