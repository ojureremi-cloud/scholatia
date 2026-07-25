export type JournalFeature = {
  listPath: string;
};

export const journalFeature: JournalFeature = {
  listPath: '/journals',
};

export { default as JournalCard } from '@/components/journals/JournalCard';
export { default as JournalHeader } from '@/components/journals/JournalHeader';
export { default as JournalStatistics } from '@/components/journals/JournalStatistics';
export { default as JournalBadge } from '@/components/journals/JournalBadge';
export { default as EditorialBoardCard } from '@/components/journals/EditorialBoardCard';
export { default as SubmissionStatusCard } from '@/components/journals/SubmissionStatusCard';
export { default as PeerReviewCard } from '@/components/journals/PeerReviewCard';
export { default as ReviewerCard } from '@/components/journals/ReviewerCard';
export { default as PublicationTimeline } from '@/components/journals/PublicationTimeline';
export { default as ArticleCard } from '@/components/journals/ArticleCard';
export { default as IssueCard } from '@/components/journals/IssueCard';
export { default as VolumeCard } from '@/components/journals/VolumeCard';
