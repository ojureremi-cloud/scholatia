import { Badge } from '@/components/ui';
import type { ApprovalStatus, ReviewDecision, ReviewKind, ReviewStatus } from '@/types/reviews';
import {
  approvalStatusVariant,
  formatApprovalStatus,
  formatReviewDecision,
  formatReviewKind,
  formatReviewKindIcon,
  formatReviewStatus,
  reviewDecisionVariant,
  reviewKindVariant,
  reviewStatusVariant,
} from './format';

type ReviewKindBadgeProps = {
  kind: ReviewKind;
};

export function ReviewKindBadge({ kind }: ReviewKindBadgeProps) {
  return (
    <Badge variant={reviewKindVariant(kind)}>
      {formatReviewKindIcon(kind)} {formatReviewKind(kind)}
    </Badge>
  );
}

type ReviewStatusBadgeProps = {
  status: ReviewStatus;
};

export function ReviewStatusBadge({ status }: ReviewStatusBadgeProps) {
  return <Badge variant={reviewStatusVariant(status)}>{formatReviewStatus(status)}</Badge>;
}

type ReviewDecisionBadgeProps = {
  decision: ReviewDecision;
};

export function ReviewDecisionBadge({ decision }: ReviewDecisionBadgeProps) {
  return <Badge variant={reviewDecisionVariant(decision)}>{formatReviewDecision(decision)}</Badge>;
}

type ApprovalStatusBadgeProps = {
  status: ApprovalStatus;
};

export function ApprovalStatusBadge({ status }: ApprovalStatusBadgeProps) {
  return <Badge variant={approvalStatusVariant(status)}>{formatApprovalStatus(status)}</Badge>;
}
