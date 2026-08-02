'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  APPROVAL_HISTORY,
  APPROVALS,
  CURRENT_REVIEW_USER,
  DEFAULT_APPROVAL,
  DEFAULT_REVIEW,
  DEFAULT_REVIEW_CYCLE,
  REVIEW_ANALYTICS,
  REVIEW_CYCLES,
  REVIEW_STATISTICS,
} from '@/constants/placeholder-reviews';
import {
  approveApproval,
  applyApprovalAction,
  completeReviewCycle,
  createApproval,
  createReviewCycle,
  openNextReviewRound,
  requestApprovalMinorRevision,
  submitReview,
} from '@/lib/reviews';
import type {
  ApprovalAction,
  ApprovalKind,
  Review,
  ReviewCycle,
  ReviewDecision,
} from '@/types/reviews';

const CURRENT_USER_NAME = 'Dr. Adebisi Ojurere';

export default function useReviews() {
  const [cycles, setCycles] = useState(REVIEW_CYCLES);
  const [approvals, setApprovals] = useState(APPROVALS);

  const statistics = useMemo(() => REVIEW_STATISTICS, []);
  const analytics = useMemo(() => REVIEW_ANALYTICS, []);
  const history = useMemo(() => APPROVAL_HISTORY, []);

  const activeCycles = useMemo(
    () => cycles.filter((cycle) => cycle.status === 'open' || cycle.status === 'in-progress'),
    [cycles],
  );

  const completedCycles = useMemo(() => cycles.filter((cycle) => cycle.status === 'completed'), [cycles]);

  const myReviews = useMemo(
    () =>
      cycles
        .flatMap((cycle) => cycle.reviews)
        .filter((review) => review.reviewer === CURRENT_REVIEW_USER),
    [cycles],
  );

  const pendingReviews = useMemo(
    () =>
      cycles
        .flatMap((cycle) => cycle.reviews)
        .filter((review) => review.status === 'invited' || review.status === 'accepted' || review.status === 'in-progress'),
    [cycles],
  );

  const pendingApprovals = useMemo(
    () => approvals.filter((approval) => approval.status === 'pending'),
    [approvals],
  );

  const decidedApprovals = useMemo(
    () =>
      approvals.filter(
        (approval) => approval.status === 'approved' || approval.status === 'rejected',
      ),
    [approvals],
  );

  const cycleById = useCallback((id: string) => cycles.find((cycle) => cycle.id === id), [cycles]);

  const reviewById = useCallback(
    (id: string) => cycles.flatMap((cycle) => cycle.reviews).find((review) => review.id === id),
    [cycles],
  );

  const approvalById = useCallback(
    (id: string) => approvals.find((approval) => approval.id === id),
    [approvals],
  );

  const openCycle = useCallback(
    (input: { workflowId?: string; sourceId?: string; sourceEntity?: string }) => {
      const created = createReviewCycle({
        round: 1,
        workflowId: input.workflowId,
        sourceId: input.sourceId,
        sourceEntity: input.sourceEntity,
        requestedBy: CURRENT_REVIEW_USER,
        requestedByName: CURRENT_USER_NAME,
      });
      setCycles((current) => [created, ...current]);
      return created;
    },
    [],
  );

  const submitCycleReview = useCallback(
    (cycleId: string, reviewId: string, decision: ReviewDecision) => {
      setCycles((current) =>
        current.map((cycle) => {
          if (cycle.id !== cycleId) {
            return cycle;
          }
          const review = cycle.reviews.find((entry) => entry.id === reviewId);
          if (!review) {
            return cycle;
          }
          return { ...cycle, reviews: cycle.reviews.map((entry) => (entry.id === reviewId ? submitReview({ review: entry, decision }) : entry)) };
        }),
      );
    },
    [],
  );

  const completeCycle = useCallback((cycleId: string) => {
    setCycles((current) =>
      current.map((cycle) => (cycle.id === cycleId ? completeReviewCycle(cycle) : cycle)),
    );
  }, []);

  const openNextRound = useCallback((cycleId: string) => {
    setCycles((current) =>
      current.map((cycle) => (cycle.id === cycleId ? openNextReviewRound(cycle) : cycle)),
    );
  }, []);

  const createNewApproval = useCallback(
    (input: { kind: ApprovalKind; title: string; description?: string; approver: string; approverName: string; approverRole?: string; workflowId?: string; sourceId?: string; sourceEntity?: string }) => {
      const created = createApproval({
        kind: input.kind,
        title: input.title,
        description: input.description,
        approver: input.approver,
        approverName: input.approverName,
        approverRole: input.approverRole,
        requestedBy: CURRENT_REVIEW_USER,
        requestedByName: CURRENT_USER_NAME,
        workflowId: input.workflowId,
        sourceId: input.sourceId,
        sourceEntity: input.sourceEntity,
      });
      setApprovals((current) => [created, ...current]);
      return created;
    },
    [],
  );

  const decideApproval = useCallback((approvalId: string, action: ApprovalAction, comment?: string) => {
    setApprovals((current) =>
      current.map((approval) => {
        if (approval.id !== approvalId) {
          return approval;
        }
        if (action === 'approve') {
          return approveApproval(approval, CURRENT_REVIEW_USER, CURRENT_USER_NAME, comment).approval;
        }
        if (action === 'minor-revision') {
          return requestApprovalMinorRevision(approval, CURRENT_REVIEW_USER, CURRENT_USER_NAME, comment ?? '').approval;
        }
        return applyApprovalAction({ approval, action, actor: CURRENT_REVIEW_USER, actorName: CURRENT_USER_NAME, comment }).approval;
      }),
    );
  }, []);

  return useMemo(
    () => ({
      cycles,
      approvals,
      statistics,
      analytics,
      history,
      activeCycles,
      completedCycles,
      myReviews,
      pendingReviews,
      pendingApprovals,
      decidedApprovals,
      defaultReview: DEFAULT_REVIEW,
      defaultReviewCycle: DEFAULT_REVIEW_CYCLE,
      defaultApproval: DEFAULT_APPROVAL,
      currentUser: CURRENT_REVIEW_USER,
      currentUserName: CURRENT_USER_NAME,
      cycleById,
      reviewById,
      approvalById,
      openCycle,
      submitCycleReview,
      completeCycle,
      openNextRound,
      createNewApproval,
      decideApproval,
    }),
    [
      cycles,
      approvals,
      statistics,
      analytics,
      history,
      activeCycles,
      completedCycles,
      myReviews,
      pendingReviews,
      pendingApprovals,
      decidedApprovals,
      cycleById,
      reviewById,
      approvalById,
      openCycle,
      submitCycleReview,
      completeCycle,
      openNextRound,
      createNewApproval,
      decideApproval,
    ],
  );
}

export type { Review, ReviewCycle };
