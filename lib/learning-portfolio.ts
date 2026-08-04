import { isAssessmentPassing } from '@/lib/learning';
import type {
  LearningAssessment,
  LearningBadge,
  LearningCertificate,
  LearningCpdRecord,
  LearningEvent,
  LearningMentorship,
  LearningPortfolio,
  LearningPortfolioCoverage,
  LearningPortfolioEvidence,
  LearningPortfolioEvidenceKind,
  LearningProgressEntry,
  LearningValidationIssue,
  PortfolioItem,
  PortfolioKind,
} from '@/types/learning';

/**
 * Portfolio Engine — Wave 2 of the Scholatia Learning Ecosystem.
 *
 * Pure evidence collection, validation, portfolio generation, portfolio
 * updates, learning passport updates, and attachment of certificates,
 * badges, research outputs, teaching activities, and mentorship activity.
 * Side-effect free and UI-independent.
 */

/** Sources the portfolio engine can auto-collect evidence from. */
export type LearningEvidenceSourceInput = {
  learnerUsername: string;
  certificates?: readonly LearningCertificate[];
  badges?: readonly LearningBadge[];
  cpdRecords?: readonly LearningCpdRecord[];
  assessments?: readonly LearningAssessment[];
  progress?: readonly LearningProgressEntry[];
  events?: readonly LearningEvent[];
  attendedEventIds?: readonly string[];
  mentorships?: readonly LearningMentorship[];
  publications?: readonly { id: string; title: string; date?: string }[];
  teachingActivities?: readonly { id: string; title: string; date?: string }[];
  researchOutputs?: readonly { id: string; title: string; date?: string }[];
};

const PORTFOLIO_KINDS_BY_EVIDENCE: Record<LearningPortfolioEvidenceKind, readonly PortfolioKind[]> = {
  certificate: ['certification', 'academic'],
  badge: ['digital-badges', 'certification'],
  cpd: ['professional'],
  'research-output': ['research'],
  'teaching-activity': ['teaching'],
  'mentorship-activity': ['leadership', 'community'],
  assessment: ['competency', 'academic'],
  event: ['community', 'professional'],
  publication: ['research', 'awards'],
  reflection: ['academic'],
};

export function portfolioEvidenceId(kind: LearningPortfolioEvidenceKind, sourceRef: string): string {
  return `ev-${kind}-${sourceRef}`;
}

/** Validate a piece of portfolio evidence. */
export function validatePortfolioEvidence(evidence: LearningPortfolioEvidence): LearningValidationIssue[] {
  const issues: LearningValidationIssue[] = [];
  if (!evidence.title || evidence.title.trim().length === 0) {
    issues.push({ code: 'missing-field', severity: 'error', message: 'Evidence requires a title', field: 'title' });
  }
  if (!evidence.sourceRef) {
    issues.push({ code: 'broken-reference', severity: 'warning', message: 'Evidence has no source reference', field: 'sourceRef' });
  }
  if (!evidence.verified) {
    issues.push({ code: 'credential-invalid', severity: 'warning', message: 'Evidence is not yet verified', field: 'verified' });
  }
  if (evidence.portfolioKinds.length === 0) {
    issues.push({ code: 'missing-field', severity: 'error', message: 'Evidence maps to no portfolio kinds', field: 'portfolioKinds' });
  }
  return issues;
}

function evidenceFor(
  learnerUsername: string,
  kind: LearningPortfolioEvidenceKind,
  title: string,
  sourceRef: string,
  date?: string,
): LearningPortfolioEvidence {
  return {
    id: portfolioEvidenceId(kind, sourceRef),
    learnerUsername,
    kind,
    title,
    sourceRef,
    date,
    verified: true,
    portfolioKinds: [...PORTFOLIO_KINDS_BY_EVIDENCE[kind]],
  };
}

/**
 * Automatically collect verified evidence from a learner's credentials,
 * completed assessments, attended events, active mentorships, publications,
 * teaching activities, and research outputs.
 */
export function collectEvidence(input: LearningEvidenceSourceInput): LearningPortfolioEvidence[] {
  const evidence: LearningPortfolioEvidence[] = [];
  const learner = input.learnerUsername;

  (input.certificates ?? []).forEach((certificate) => {
    if (certificate.learnerUsername !== learner) return;
    evidence.push(evidenceFor(learner, 'certificate', certificate.title, certificate.verificationReference, certificate.completedAt));
  });
  (input.badges ?? []).forEach((badge) => {
    if (badge.learnerUsername !== learner) return;
    evidence.push(evidenceFor(learner, 'badge', badge.title, badge.verificationReference, badge.issuedAt));
  });
  (input.cpdRecords ?? []).forEach((record) => {
    if (record.learnerUsername !== learner) return;
    evidence.push(evidenceFor(learner, 'cpd', record.activityTitle, record.verificationReference, record.activityDate ?? record.issuedAt));
  });
  (input.assessments ?? []).forEach((assessment) => {
    const entry = (input.progress ?? []).find((candidate) => candidate.learningObjectId === assessment.id);
    if (!entry || entry.state !== 'completed' || entry.score === undefined || !isAssessmentPassing(assessment, entry.score)) return;
    evidence.push(evidenceFor(learner, 'assessment', assessment.title, assessment.id, entry.completedAt));
  });
  const attended = new Set(input.attendedEventIds ?? []);
  (input.events ?? []).forEach((event) => {
    if (!attended.has(event.id)) return;
    evidence.push(evidenceFor(learner, 'event', event.title, event.id, event.startAt));
  });
  (input.mentorships ?? []).forEach((mentorship) => {
    if (mentorship.menteeUsername !== learner || !['active', 'agreed', 'matched'].includes(mentorship.status)) return;
    evidence.push(evidenceFor(learner, 'mentorship-activity', `Mentorship with ${mentorship.mentorName}`, mentorship.id, mentorship.startedAt));
  });
  (input.publications ?? []).forEach((publication) => {
    evidence.push(evidenceFor(learner, 'publication', publication.title, publication.id, publication.date));
  });
  (input.teachingActivities ?? []).forEach((activity) => {
    evidence.push(evidenceFor(learner, 'teaching-activity', activity.title, activity.id, activity.date));
  });
  (input.researchOutputs ?? []).forEach((output) => {
    evidence.push(evidenceFor(learner, 'research-output', output.title, output.id, output.date));
  });

  return evidence;
}

/** Validated evidence only (filters out hard errors). */
export function validatedEvidence(evidence: readonly LearningPortfolioEvidence[]): LearningPortfolioEvidence[] {
  return evidence.filter((item) => validatePortfolioEvidence(item).every((issue) => issue.severity !== 'error'));
}

function evidenceToItem(evidence: LearningPortfolioEvidence, kind: PortfolioKind): PortfolioItem {
  return {
    id: evidence.id,
    title: evidence.title,
    kind,
    date: evidence.date,
    evidenceRef: evidence.sourceRef,
    evidenceType: evidence.kind,
    visibility: 'private',
  };
}

/** Generate a portfolio of one kind from collected evidence. */
export function generatePortfolio(input: {
  learnerUsername: string;
  kind: PortfolioKind;
  title: string;
  description: string;
  evidence: readonly LearningPortfolioEvidence[];
  createdAt?: string;
}): LearningPortfolio {
  const createdAt = input.createdAt ?? new Date().toISOString();
  return {
    id: `port-${input.learnerUsername}-${input.kind}`,
    learnerUsername: input.learnerUsername,
    kind: input.kind,
    title: input.title,
    description: input.description,
    items: validatedEvidence(input.evidence)
      .filter((item) => item.portfolioKinds.includes(input.kind))
      .map((item) => evidenceToItem(item, input.kind)),
    createdAt,
    updatedAt: createdAt,
  };
}

/** Append an item to a portfolio (immutable). */
export function updatePortfolio(portfolio: LearningPortfolio, item: PortfolioItem): LearningPortfolio {
  return {
    ...portfolio,
    items: [...portfolio.items, item],
    updatedAt: new Date().toISOString(),
  };
}

/** Attach a certificate to a portfolio. */
export function attachCertificate(portfolio: LearningPortfolio, certificate: LearningCertificate): LearningPortfolio {
  const item: PortfolioItem = {
    id: certificate.id,
    title: certificate.title,
    kind: portfolio.kind,
    date: certificate.completedAt,
    evidenceRef: certificate.verificationReference,
    evidenceType: 'certificate',
    visibility: 'private',
  };
  return updatePortfolio(portfolio, item);
}

/** Attach a badge to a portfolio. */
export function attachBadge(portfolio: LearningPortfolio, badge: LearningBadge): LearningPortfolio {
  const item: PortfolioItem = {
    id: badge.id,
    title: badge.title,
    kind: portfolio.kind,
    date: badge.issuedAt,
    evidenceRef: badge.verificationReference,
    evidenceType: 'badge',
    visibility: 'private',
  };
  return updatePortfolio(portfolio, item);
}

/** Attach a research output to a portfolio. */
export function attachResearchOutput(
  portfolio: LearningPortfolio,
  output: { id: string; title: string; date?: string },
): LearningPortfolio {
  const item: PortfolioItem = {
    id: output.id,
    title: output.title,
    kind: portfolio.kind,
    date: output.date,
    evidenceRef: output.id,
    evidenceType: 'research-output',
    visibility: 'private',
  };
  return updatePortfolio(portfolio, item);
}

/** Attach a teaching activity to a portfolio. */
export function attachTeachingActivity(
  portfolio: LearningPortfolio,
  activity: { id: string; title: string; date?: string },
): LearningPortfolio {
  const item: PortfolioItem = {
    id: activity.id,
    title: activity.title,
    kind: portfolio.kind,
    date: activity.date,
    evidenceRef: activity.id,
    evidenceType: 'teaching-activity',
    visibility: 'private',
  };
  return updatePortfolio(portfolio, item);
}

/** Attach a mentorship activity to a portfolio. */
export function attachMentorshipActivity(portfolio: LearningPortfolio, mentorship: LearningMentorship): LearningPortfolio {
  const item: PortfolioItem = {
    id: mentorship.id,
    title: `Mentorship with ${mentorship.mentorName}`,
    kind: portfolio.kind,
    date: mentorship.startedAt,
    evidenceRef: mentorship.id,
    evidenceType: 'mentorship-activity',
    visibility: 'private',
  };
  return updatePortfolio(portfolio, item);
}

/** Portfolio coverage for a learner across portfolio kinds. */
export function portfolioCoverage(portfolios: readonly LearningPortfolio[], learnerUsername: string): LearningPortfolioCoverage {
  const owned = portfolios.filter((portfolio) => portfolio.learnerUsername === learnerUsername);
  const items = owned.flatMap((portfolio) => portfolio.items);
  return {
    learnerUsername,
    kinds: owned.map((portfolio) => portfolio.kind),
    itemCount: items.length,
    sharedCount: items.filter((item) => item.visibility === 'shared').length,
    publicCount: items.filter((item) => item.visibility === 'public').length,
  };
}
