import { Badge } from '@/components/ui';
import type {
  AnnotationCommentType,
  AnnotationDecision,
  AnnotationRole,
  AnnotationStatus,
  AnnotationType,
} from '@/types/annotations';
import {
  annotationCommentTypeIcon,
  annotationDecisionVariant,
  annotationRoleVariant,
  annotationStatusVariant,
  annotationTypeIcon,
  annotationTypeVariant,
  formatAnnotationCommentType,
  formatAnnotationDecision,
  formatAnnotationRole,
  formatAnnotationStatus,
  formatAnnotationType,
} from './format';

type AnnotationTypeBadgeProps = {
  type: AnnotationType;
};

export function AnnotationTypeBadge({ type }: AnnotationTypeBadgeProps) {
  return (
    <Badge variant={annotationTypeVariant(type)}>
      {annotationTypeIcon(type)} {formatAnnotationType(type)}
    </Badge>
  );
}

type AnnotationRoleBadgeProps = {
  role: AnnotationRole;
};

export function AnnotationRoleBadge({ role }: AnnotationRoleBadgeProps) {
  return <Badge variant={annotationRoleVariant(role)}>{formatAnnotationRole(role)}</Badge>;
}

type AnnotationStatusBadgeProps = {
  status: AnnotationStatus;
};

export function AnnotationStatusBadge({ status }: AnnotationStatusBadgeProps) {
  return <Badge variant={annotationStatusVariant(status)}>{formatAnnotationStatus(status)}</Badge>;
}

type AnnotationDecisionBadgeProps = {
  decision: AnnotationDecision;
};

export function AnnotationDecisionBadge({ decision }: AnnotationDecisionBadgeProps) {
  return (
    <Badge variant={annotationDecisionVariant(decision)}>{formatAnnotationDecision(decision)}</Badge>
  );
}

type AnnotationCommentTypeBadgeProps = {
  type: AnnotationCommentType;
};

export function AnnotationCommentTypeBadge({ type }: AnnotationCommentTypeBadgeProps) {
  return (
    <Badge variant="default">
      {annotationCommentTypeIcon(type)} {formatAnnotationCommentType(type)}
    </Badge>
  );
}
