import type { Annotation } from '@/types/annotations';
import { AnnotationCard } from './AnnotationCard';

type AnnotationReviewDiscussionProps = {
  annotations: Annotation[];
  onReact?: (id: string, emoji: string) => void;
  onReply?: (id: string, body: string) => void;
};

/**
 * Review discussion surface: renders annotations as the threaded scholarly
 * discussion attached to a source record. The same cards power the review
 * centre, editorial workflows, supervision, and grants — the engine is
 * SAES-independent.
 */
export function AnnotationReviewDiscussion({
  annotations,
  onReact,
  onReply,
}: AnnotationReviewDiscussionProps) {
  const discussion = [...annotations].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="space-y-6">
      {discussion.map((annotation) => (
        <AnnotationCard
          key={annotation.id}
          annotation={annotation}
          onReact={onReact ? (emoji) => onReact(annotation.id, emoji) : undefined}
          onReply={onReply ? (body) => onReply(annotation.id, body) : undefined}
        />
      ))}
    </div>
  );
}
