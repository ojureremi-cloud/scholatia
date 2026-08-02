'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  ANNOTATION_ANALYTICS,
  ANNOTATION_HISTORY,
  ANNOTATIONS,
  CURRENT_ANNOTATION_USER,
  CURRENT_ANNOTATION_USER_NAME,
  DEFAULT_ANNOTATION,
} from '@/constants/placeholder-annotations';
import {
  addAnnotationReaction,
  addThreadReply,
  annotationStatistics,
  applyAnnotationDecision,
  archiveAnnotation,
  createAnnotation,
  reopenAnnotation,
  toggleAnnotationBookmark,
} from '@/lib/annotations';
import type {
  Annotation,
  AnnotationAnalytics,
  AnnotationDecision,
  AnnotationStatistics,
} from '@/types/annotations';

export default function useAnnotations() {
  const [annotations, setAnnotations] = useState(ANNOTATIONS);

  const statistics: AnnotationStatistics = useMemo(
    () => annotationStatistics(annotations),
    [annotations],
  );
  const analytics: AnnotationAnalytics = useMemo(
    () => ANNOTATION_ANALYTICS,
    [],
  );
  const history = useMemo(() => ANNOTATION_HISTORY, []);

  const openAnnotations = useMemo(
    () => annotations.filter((annotation) => annotation.status === 'open'),
    [annotations],
  );

  const pendingAnnotations = useMemo(
    () => annotations.filter((annotation) => annotation.status === 'pending'),
    [annotations],
  );

  const resolvedAnnotations = useMemo(
    () =>
      annotations.filter(
        (annotation) =>
          annotation.status === 'accepted' ||
          annotation.status === 'resolved' ||
          annotation.status === 'rejected',
      ),
    [annotations],
  );

  const myAnnotations = useMemo(
    () => annotations.filter((annotation) => annotation.author === CURRENT_ANNOTATION_USER),
    [annotations],
  );

  const mentionsForUser = useMemo(
    () =>
      annotations.filter((annotation) =>
        annotation.mentions.some((mention) => mention.username === CURRENT_ANNOTATION_USER),
      ),
    [annotations],
  );

  const bookmarkedForUser = useMemo(
    () =>
      annotations.filter((annotation) =>
        annotation.bookmarks.some((bookmark) => bookmark.user === CURRENT_ANNOTATION_USER),
      ),
    [annotations],
  );

  const annotationById = useCallback(
    (id: string) => annotations.find((annotation) => annotation.id === id),
    [annotations],
  );

  const create = useCallback(
    (input: {
      sourceEntity: string;
      sourceId: string;
      type: Annotation['type'];
      commentType: Annotation['commentType'];
      role: Annotation['role'];
      title: string;
      body: string;
    }) => {
      const created = createAnnotation({
        sourceEntity: input.sourceEntity,
        sourceId: input.sourceId,
        type: input.type,
        commentType: input.commentType,
        role: input.role,
        author: CURRENT_ANNOTATION_USER,
        authorName: CURRENT_ANNOTATION_USER_NAME,
        title: input.title,
        body: input.body,
        location: {
          sourceEntity: input.sourceEntity,
          sourceId: input.sourceId,
          target: 'document',
        },
      });
      setAnnotations((current) => [created, ...current]);
      return created;
    },
    [],
  );

  const decide = useCallback(
    (id: string, decision: AnnotationDecision, comment?: string) => {
      setAnnotations((current) =>
        current.map((annotation) =>
          annotation.id === id
            ? applyAnnotationDecision({
                annotation,
                decision,
                actor: CURRENT_ANNOTATION_USER,
                actorName: CURRENT_ANNOTATION_USER_NAME,
                comment,
              })
            : annotation,
        ),
      );
    },
    [],
  );

  const archive = useCallback(
    (id: string, comment?: string) => {
      setAnnotations((current) =>
        current.map((annotation) =>
          annotation.id === id
            ? archiveAnnotation(
                annotation,
                CURRENT_ANNOTATION_USER,
                CURRENT_ANNOTATION_USER_NAME,
                comment,
              )
            : annotation,
        ),
      );
    },
    [],
  );

  const reopen = useCallback((id: string) => {
    setAnnotations((current) =>
      current.map((annotation) =>
        annotation.id === id
          ? reopenAnnotation(annotation, CURRENT_ANNOTATION_USER, CURRENT_ANNOTATION_USER_NAME)
          : annotation,
      ),
    );
  }, []);

  const reply = useCallback(
    (id: string, body: string) => {
      setAnnotations((current) =>
        current.map((annotation) =>
          annotation.id === id
            ? addThreadReply(annotation, {
                author: CURRENT_ANNOTATION_USER,
                authorName: CURRENT_ANNOTATION_USER_NAME,
                body,
              })
            : annotation,
        ),
      );
    },
    [],
  );

  const react = useCallback(
    (id: string, emoji: string) => {
      setAnnotations((current) =>
        current.map((annotation) =>
          annotation.id === id
            ? addAnnotationReaction(annotation, {
                emoji,
                actor: CURRENT_ANNOTATION_USER,
                actorName: CURRENT_ANNOTATION_USER_NAME,
              })
            : annotation,
        ),
      );
    },
    [],
  );

  const toggleBookmark = useCallback((id: string) => {
    setAnnotations((current) =>
      current.map((annotation) =>
        annotation.id === id
          ? toggleAnnotationBookmark(
              annotation,
              CURRENT_ANNOTATION_USER,
              CURRENT_ANNOTATION_USER_NAME,
            )
          : annotation,
      ),
    );
  }, []);

  return useMemo(
    () => ({
      annotations,
      statistics,
      analytics,
      history,
      openAnnotations,
      pendingAnnotations,
      resolvedAnnotations,
      myAnnotations,
      mentionsForUser,
      bookmarkedForUser,
      defaultAnnotation: DEFAULT_ANNOTATION,
      currentUser: CURRENT_ANNOTATION_USER,
      currentUserName: CURRENT_ANNOTATION_USER_NAME,
      annotationById,
      create,
      decide,
      archive,
      reopen,
      reply,
      react,
      toggleBookmark,
    }),
    [
      annotations,
      statistics,
      analytics,
      history,
      openAnnotations,
      pendingAnnotations,
      resolvedAnnotations,
      myAnnotations,
      mentionsForUser,
      bookmarkedForUser,
      annotationById,
      create,
      decide,
      archive,
      reopen,
      reply,
      react,
      toggleBookmark,
    ],
  );
}

export type { Annotation, AnnotationAnalytics, AnnotationStatistics };
