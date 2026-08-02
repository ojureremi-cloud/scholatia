'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  COMMENT_ANALYTICS,
  COMMENT_THREADS,
  CURRENT_COMMENT_USER,
  CURRENT_COMMENT_USER_NAME,
  DEFAULT_THREAD,
  DEFAULT_VOICE_COMMENT,
  TRANSCRIPTION_PROVIDERS,
  VOICE_COMMENTS,
} from '@/constants/placeholder-comments';
import {
  addComment,
  addCommentReaction,
  addReply,
  addReplyReaction,
  archiveThread,
  commentStatistics,
  createCommentThread,
  editTranscript,
  regenerateTranscript,
  reopenThread,
  resolveThread,
  summarizeVoiceComment,
  transcribeVoiceComment,
  voiceCommentsForSource,
} from '@/lib/comments';
import type {
  CommentAnalytics,
  CommentStatistics,
  CommentThread,
  ThreadStatus,
  TranscriptionProvider,
  VoiceComment,
} from '@/types/comments';

export default function useComments() {
  const [threads, setThreads] = useState(COMMENT_THREADS);
  const [voiceComments, setVoiceComments] = useState(VOICE_COMMENTS);

  const statistics: CommentStatistics = useMemo(
    () => commentStatistics(threads, voiceComments),
    [threads, voiceComments],
  );
  const analytics: CommentAnalytics = useMemo(() => COMMENT_ANALYTICS, []);
  const providers: TranscriptionProvider[] = useMemo(() => TRANSCRIPTION_PROVIDERS, []);

  const openThreads = useMemo(
    () => threads.filter((thread) => thread.status === 'open'),
    [threads],
  );

  const resolvedThreads = useMemo(
    () => threads.filter((thread) => thread.status === 'resolved'),
    [threads],
  );

  const archivedThreads = useMemo(
    () => threads.filter((thread) => thread.status === 'archived'),
    [threads],
  );

  const myThreads = useMemo(
    () =>
      threads.filter((thread) =>
        thread.comments.some((comment) => comment.author === CURRENT_COMMENT_USER),
      ),
    [threads],
  );

  const threadById = useCallback(
    (id: string) => threads.find((thread) => thread.id === id),
    [threads],
  );

  const threadsForEntity = useCallback(
    (sourceEntity: string, sourceId: string) =>
      threads.filter(
        (thread) => thread.sourceEntity === sourceEntity && thread.sourceId === sourceId,
      ),
    [threads],
  );

  const voiceForEntity = useCallback(
    (sourceEntity: string, sourceId: string) =>
      voiceCommentsForSource(voiceComments, sourceEntity, sourceId),
    [voiceComments],
  );

  const createThread = useCallback(
    (input: {
      sourceEntity: string;
      sourceId: string;
      title?: string;
      kind?: CommentThread['kind'];
    }) => {
      const created = createCommentThread({
        sourceEntity: input.sourceEntity,
        sourceId: input.sourceId,
        title: input.title,
        kind: input.kind,
      });
      setThreads((current) => [created, ...current]);
      return created;
    },
    [],
  );

  const postComment = useCallback(
    (threadId: string, body: string) => {
      setThreads((current) =>
        current.map((thread) =>
          thread.id === threadId
            ? addComment(thread, {
                author: CURRENT_COMMENT_USER,
                authorName: CURRENT_COMMENT_USER_NAME,
                body,
              })
            : thread,
        ),
      );
    },
    [],
  );

  const postReply = useCallback(
    (threadId: string, body: string, parentReplyId?: string) => {
      setThreads((current) =>
        current.map((thread) =>
          thread.id === threadId
            ? addReply(thread, {
                author: CURRENT_COMMENT_USER,
                authorName: CURRENT_COMMENT_USER_NAME,
                body,
                parentReplyId,
              })
            : thread,
        ),
      );
    },
    [],
  );

  const setThreadStatus = useCallback((threadId: string, status: ThreadStatus) => {
    setThreads((current) =>
      current.map((thread) => {
        if (thread.id !== threadId) {
          return thread;
        }
        if (status === 'resolved') {
          return resolveThread(thread);
        }
        if (status === 'archived') {
          return archiveThread(thread);
        }
        return reopenThread(thread);
      }),
    );
  }, []);

  const reactToComment = useCallback(
    (threadId: string, commentId: string, emoji: string) => {
      setThreads((current) =>
        current.map((thread) =>
          thread.id === threadId
            ? addCommentReaction(thread, commentId, {
                emoji,
                actor: CURRENT_COMMENT_USER,
                actorName: CURRENT_COMMENT_USER_NAME,
              })
            : thread,
        ),
      );
    },
    [],
  );

  const reactToReply = useCallback(
    (threadId: string, replyId: string, emoji: string) => {
      setThreads((current) =>
        current.map((thread) =>
          thread.id === threadId
            ? addReplyReaction(thread, replyId, {
                emoji,
                actor: CURRENT_COMMENT_USER,
                actorName: CURRENT_COMMENT_USER_NAME,
              })
            : thread,
        ),
      );
    },
    [],
  );

  const transcribe = useCallback((id: string, text: string, confidence?: number) => {
    setVoiceComments((current) =>
      current.map((voiceComment) =>
        voiceComment.id === id
          ? transcribeVoiceComment({
              voiceComment,
              text,
              confidence: confidence ?? 0.9,
            })
          : voiceComment,
      ),
    );
  }, []);

  const editTranscriptOf = useCallback((id: string, text: string) => {
    setVoiceComments((current) =>
      current.map((voiceComment) =>
        voiceComment.id === id ? editTranscript(voiceComment, text) : voiceComment,
      ),
    );
  }, []);

  const regenerateTranscriptOf = useCallback((id: string, text: string) => {
    setVoiceComments((current) =>
      current.map((voiceComment) =>
        voiceComment.id === id ? regenerateTranscript(voiceComment, text) : voiceComment,
      ),
    );
  }, []);

  const summarize = useCallback((id: string) => {
    setVoiceComments((current) =>
      current.map((voiceComment) =>
        voiceComment.id === id
          ? { ...voiceComment, aiSummary: summarizeVoiceComment(voiceComment) }
          : voiceComment,
      ),
    );
  }, []);

  return useMemo(
    () => ({
      threads,
      voiceComments,
      statistics,
      analytics,
      providers,
      openThreads,
      resolvedThreads,
      archivedThreads,
      myThreads,
      defaultThread: DEFAULT_THREAD,
      defaultVoiceComment: DEFAULT_VOICE_COMMENT,
      currentUser: CURRENT_COMMENT_USER,
      currentUserName: CURRENT_COMMENT_USER_NAME,
      threadById,
      threadsForEntity,
      voiceForEntity,
      createThread,
      postComment,
      postReply,
      setThreadStatus,
      reactToComment,
      reactToReply,
      transcribe,
      editTranscriptOf,
      regenerateTranscriptOf,
      summarize,
    }),
    [
      threads,
      voiceComments,
      statistics,
      analytics,
      providers,
      openThreads,
      resolvedThreads,
      archivedThreads,
      myThreads,
      threadById,
      threadsForEntity,
      voiceForEntity,
      createThread,
      postComment,
      postReply,
      setThreadStatus,
      reactToComment,
      reactToReply,
      transcribe,
      editTranscriptOf,
      regenerateTranscriptOf,
      summarize,
    ],
  );
}

export type { CommentStatistics, CommentAnalytics, CommentThread, VoiceComment, TranscriptionProvider };
