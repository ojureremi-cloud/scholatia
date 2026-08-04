import Badge from '@/components/ui/Badge';
import {
  courseKindLabel,
  courseKindVariant,
  credentialKindLabel,
  credentialKindIcon,
  credentialStatusLabel,
  credentialStatusVariant,
  domainIcon,
  domainLabel,
  domainVariant,
  eventKindIcon,
  eventKindLabel,
  eventKindVariant,
  eventModeLabel,
  eventModeVariant,
  goalStatusLabel,
  goalStatusVariant,
  levelName,
  levelVariant,
  progressStateLabel,
  progressVariant,
  recommendationKindIcon,
  recommendationKindLabel,
  recommendationKindVariant,
  recommendationScopeLabel,
} from './format';
import type { BadgeTone } from './format';
import type {
  CompetencyDomain,
  CompetencyLevel,
  CourseKind,
  CredentialKind,
  CredentialStatus,
  GoalStatus,
  LearningEventKind,
  LearningEventMode,
  LearningRecommendationScope,
  ProgressState,
  RecommendationKind,
} from '@/types/learning';

export function CourseKindBadge({ kind }: { kind: CourseKind }) {
  return <Badge variant={courseKindVariant(kind)}>{courseKindLabel(kind)}</Badge>;
}

export function LevelBadge({ level }: { level: CompetencyLevel }) {
  return <Badge variant={levelVariant(level)}>{levelName(level)}</Badge>;
}

export function DomainBadge({ domain }: { domain: CompetencyDomain }) {
  return (
    <Badge variant={domainVariant(domain)}>
      {domainIcon(domain)} {domainLabel(domain)}
    </Badge>
  );
}

export function ProgressBadge({ state }: { state: ProgressState }) {
  return <Badge variant={progressVariant(state)}>{progressStateLabel(state)}</Badge>;
}

export function EventKindBadge({ kind }: { kind: LearningEventKind }) {
  return (
    <Badge variant={eventKindVariant(kind)}>
      {eventKindIcon(kind)} {eventKindLabel(kind)}
    </Badge>
  );
}

export function EventModeBadge({ mode }: { mode: LearningEventMode }) {
  return <Badge variant={eventModeVariant(mode)}>{eventModeLabel(mode)}</Badge>;
}

export function GoalStatusBadge({ status }: { status: GoalStatus }) {
  return <Badge variant={goalStatusVariant(status)}>{goalStatusLabel(status)}</Badge>;
}

export function CredentialKindBadge({ kind }: { kind: CredentialKind }) {
  return (
    <Badge variant="info">
      {credentialKindIcon(kind)} {credentialKindLabel(kind)}
    </Badge>
  );
}

export function CredentialStatusBadge({ status }: { status: CredentialStatus }) {
  return <Badge variant={credentialStatusVariant(status)}>{credentialStatusLabel(status)}</Badge>;
}

export function RecommendationKindBadge({ kind }: { kind: RecommendationKind }) {
  return (
    <Badge variant={recommendationKindVariant(kind)}>
      {recommendationKindIcon(kind)} {recommendationKindLabel(kind)}
    </Badge>
  );
}

export function RecommendationScopeBadge({ scope }: { scope: LearningRecommendationScope }) {
  return <Badge variant="info">{recommendationScopeLabel(scope)}</Badge>;
}

export function ProgressPercentBadge({ percent }: { percent: number }) {
  const tone: BadgeTone = percent >= 100 ? 'success' : percent >= 50 ? 'info' : percent > 0 ? 'warning' : 'default';
  return <Badge variant={tone}>{Math.round(percent)}%</Badge>;
}

export function CurriculumPositionBadge({ position }: { position: number }) {
  return <Badge variant="default">{position}</Badge>;
}
