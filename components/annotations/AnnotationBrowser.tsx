'use client';

import { useMemo, useState } from 'react';
import { EmptyState } from '@/components/ui';
import { filterAnnotations } from '@/lib/annotations';
import { ANNOTATIONS } from '@/constants/placeholder-annotations';
import type {
  AnnotationDecision,
  AnnotationRole,
  AnnotationSort,
  AnnotationStatus,
  AnnotationType,
} from '@/types/annotations';
import { AnnotationCard } from './AnnotationCard';
import { AnnotationFilters } from './AnnotationFilters';

type AnnotationBrowserProps = {
  annotations?: typeof ANNOTATIONS;
  isBookmarkedByUser?: (annotationId: string) => boolean;
  onReact?: (id: string, emoji: string) => void;
  onToggleBookmark?: (id: string) => void;
  onReply?: (id: string, body: string) => void;
  onDecide?: (id: string, decision: AnnotationDecision, comment?: string) => void;
  onArchive?: (id: string, comment?: string) => void;
  onReopen?: (id: string) => void;
};

export function AnnotationBrowser({
  annotations = ANNOTATIONS,
  isBookmarkedByUser,
  onReact,
  onToggleBookmark,
  onReply,
  onDecide,
  onArchive,
  onReopen,
}: AnnotationBrowserProps) {
  const [status, setStatus] = useState<AnnotationStatus | undefined>();
  const [type, setType] = useState<AnnotationType | undefined>();
  const [role, setRole] = useState<AnnotationRole | undefined>();
  const [sourceEntity, setSourceEntity] = useState<string | undefined>();
  const [sort, setSort] = useState<AnnotationSort>('recent');
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () =>
      filterAnnotations(annotations, {
        status,
        type,
        role,
        sourceEntity,
        query: query || undefined,
        sort,
      }),
    [annotations, status, type, role, sourceEntity, query, sort],
  );

  return (
    <div className="space-y-6">
      <AnnotationFilters
        status={status}
        type={type}
        role={role}
        sourceEntity={sourceEntity}
        sort={sort}
        query={query}
        onStatusChange={setStatus}
        onTypeChange={setType}
        onRoleChange={setRole}
        onSourceEntityChange={setSourceEntity}
        onSortChange={setSort}
        onQueryChange={setQuery}
      />
      {filtered.length === 0 ? (
        <EmptyState
          title="No annotations match"
          description="Try clearing the status, type, role, source, or search filters to see more annotations."
        />
      ) : (
        <div className="grid gap-6">
          {filtered.map((annotation) => (
            <AnnotationCard
              key={annotation.id}
              annotation={annotation}
              isBookmarkedByUser={isBookmarkedByUser?.(annotation.id)}
              onReact={onReact ? (emoji) => onReact(annotation.id, emoji) : undefined}
              onToggleBookmark={
                onToggleBookmark ? () => onToggleBookmark(annotation.id) : undefined
              }
              onReply={onReply ? (body) => onReply(annotation.id, body) : undefined}
              onDecide={
                onDecide
                  ? (decision, comment) => onDecide(annotation.id, decision, comment)
                  : undefined
              }
              onArchive={onArchive ? (comment) => onArchive(annotation.id, comment) : undefined}
              onReopen={onReopen ? () => onReopen(annotation.id) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
