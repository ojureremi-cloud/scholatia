import type {
  CitationPrediction,
  CollaborationSuggestion,
  ConferenceRecommendation,
  DatasetRecommendation,
  EmergingTopic,
  ExpertiseMatch,
  FundingRecommendation,
  InstitutionRecommendation,
  IntelligenceAnalytics,
  IntelligenceConfidence,
  IntelligenceInsight,
  IntelligencePortfolio,
  IntelligenceStatistics,
  JournalRecommendation,
  KnowledgeGraphEdge,
  KnowledgeGraphNode,
  Recommendation,
  ResearchForecast,
  ResearchGap,
  ResearchTrend,
  ResearcherSummary,
} from '@/types/intelligence';
import type { DiscoveryEntityType } from '@/types/discovery';
import type { ResearcherProfile } from '@/types/researcher';
import type { ConferenceRecord } from '@/types/conference';
import type { Institution } from '@/types/institution';
import type { Dataset } from '@/types/dataset';
import type { PublicationEntry } from '@/constants/placeholder-profile';

import { RESEARCHERS } from '@/constants/placeholder-researchers';
import { JOURNALS } from '@/constants/placeholder-journals';
import { CONFERENCES } from '@/constants/placeholder-conferences';
import { INSTITUTIONS } from '@/constants/placeholder-institutions';
import { DATASETS } from '@/constants/placeholder-datasets';
import { MANUSCRIPTS } from '@/constants/placeholder-manuscripts';
import { FUNDING_OPPORTUNITIES } from '@/constants/placeholder-funding';
import { WORKSPACE_PUBLICATIONS } from '@/constants/placeholder-research';
import { DISCOVERY_ITEMS, DISCOVERY_RELATIONSHIPS } from '@/constants/placeholder-discovery';

/**
 * The Scholarly Intelligence Platform of the Scholatia ecosystem.
 *
 * Intelligence is the AI layer that observes the rest of the ecosystem. It does
 * NOT introduce a new lifecycle stage and does NOT own its own records. Every
 * insight, recommendation, trend, prediction, gap, and graph element here is
 * derived from the existing placeholder modules (researchers, journals,
 * conferences, institutions, publishers, projects, publications, datasets,
 * manuscripts, funding, and the unified discovery index) and references the
 * original source identity so no data is duplicated.
 */

const CURRENT_DATE = '2026-07-31';
const RECENT_CUTOFF = '2026-01-01';

/** The platform focus researcher used for personalised recommendation surfaces. */
export const FOCUS_RESEARCHER: ResearcherProfile = RESEARCHERS[0];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function clampScore(value: number): number {
  return Math.max(5, Math.min(100, Math.round(value)));
}

function tally(values: Array<string | undefined>): Array<{ value: string; count: number }> {
  const counts = new Map<string, number>();
  for (const value of values) {
    if (!value) continue;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count);
}

/** Word-level token set used for soft text overlap scoring. */
function tokenSet(values: Array<string | undefined>): Set<string> {
  const tokens = new Set<string>();
  for (const value of values) {
    if (!value) continue;
    for (const word of value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/)) {
      if (word.length >= 3) tokens.add(word);
    }
  }
  return tokens;
}

/** Fraction of `source` tokens covered by `target` tokens (0-1). */
function coverageRatio(source: Set<string>, target: Set<string>): number {
  if (source.size === 0) return 0;
  let hits = 0;
  for (const token of source) {
    if (target.has(token)) hits += 1;
  }
  return hits / source.size;
}

function confidenceValue(confidence: IntelligenceConfidence): number {
  return confidence === 'high' ? 95 : confidence === 'medium' ? 70 : 45;
}

function confidenceFromScore(score: number): IntelligenceConfidence {
  return score >= 70 ? 'high' : score >= 50 ? 'medium' : 'low';
}

function confidenceAverage(values: Array<{ confidence: IntelligenceConfidence }>): number {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, value) => sum + confidenceValue(value.confidence), 0) / values.length);
}

// ---------------------------------------------------------------------------
// Researcher summaries
// ---------------------------------------------------------------------------

export function summarizeResearcher(researcher: ResearcherProfile): ResearcherSummary {
  return {
    username: researcher.username,
    said: researcher.identity.said,
    displayName: researcher.displayName,
    institution: researcher.position.institution,
    country: researcher.country,
    discipline: researcher.position.faculty,
    researchAreas: researcher.researchAreas.map((area) => area.name),
    skills: researcher.skills.map((skill) => skill.name),
    url: `/researchers/${researcher.username}`,
    trustScore: researcher.verification.trustScore,
    hIndex: researcher.impact.hIndex,
    totalCitations: researcher.impact.citationMetrics.totalCitations,
  };
}

export const RESEARCHER_SUMMARIES: ResearcherSummary[] = RESEARCHERS.map(summarizeResearcher);

export const FOCUS_RESEARCHER_SUMMARY: ResearcherSummary = summarizeResearcher(FOCUS_RESEARCHER);

/** Lower-cased keyword surface used to compare researchers and content. */
function researcherKeywords(researcher: ResearcherProfile): string[] {
  return Array.from(
    new Set([
      ...researcher.interests.flatMap((interest) => [interest.name, ...interest.keywords]),
      ...researcher.researchAreas.map((area) => area.name),
      ...researcher.skills.map((skill) => skill.name),
      ...(researcher.position.researchFocus ?? []),
    ])
  ).map((value) => value.toLowerCase());
}

// ---------------------------------------------------------------------------
// Research trends
// ---------------------------------------------------------------------------

interface TopicSeed {
  id: string;
  topic: string;
  discipline: string;
  keywords: string[];
  description: string;
}

const TREND_SEEDS: TopicSeed[] = [
  {
    id: 'trend-multilingual-nlp',
    topic: 'Multilingual NLP',
    discipline: 'Computational Linguistics',
    keywords: ['multilingual', 'natural language processing', 'nlp'],
    description: 'Systems that process many languages at once, from parsing to NLU benchmarks.',
  },
  {
    id: 'trend-low-resource',
    topic: 'Low-resource language technology',
    discipline: 'Computational Linguistics',
    keywords: ['low-resource', 'low-resource nlp', 'cross-lingual'],
    description: 'Language technology for under-resourced languages and transfer across languages.',
  },
  {
    id: 'trend-dependency-parsing',
    topic: 'Dependency parsing',
    discipline: 'Syntax',
    keywords: ['dependency parsing', 'syntax', 'parsing'],
    description: 'Syntactic analysis of sentences through dependency structures and treebanks.',
  },
  {
    id: 'trend-language-documentation',
    topic: 'Language documentation',
    discipline: 'Corpus Linguistics',
    keywords: ['language documentation', 'endangered languages', 'documentation'],
    description: 'Recording, annotating, and archiving languages, especially endangered ones.',
  },
  {
    id: 'trend-annotation',
    topic: 'Annotation & evaluation',
    discipline: 'Corpus Linguistics',
    keywords: ['annotation', 'benchmark', 'evaluation', 'guidelines'],
    description: 'Gold-standard annotation, inter-annotator agreement, and benchmarking.',
  },
  {
    id: 'trend-ai',
    topic: 'Responsible AI',
    discipline: 'Artificial Intelligence',
    keywords: ['artificial intelligence', 'responsible ai', 'machine learning'],
    description: 'Fair, transparent, and trustworthy artificial intelligence systems.',
  },
  {
    id: 'trend-open-access',
    topic: 'Open access publishing',
    discipline: 'Scholarly Communication',
    keywords: ['open access', 'open science', 'research integrity', 'peer review'],
    description: 'Open access journals, open science, and research integrity practice.',
  },
  {
    id: 'trend-digital-humanities',
    topic: 'Digital humanities',
    discipline: 'Humanities',
    keywords: ['digital humanities', 'medieval', 'history'],
    description: 'Computation applied to historical and humanities scholarship.',
  },
  {
    id: 'trend-public-health',
    topic: 'Public health in Africa',
    discipline: 'Public Health',
    keywords: ['public health', 'epidemiology', 'maternal', 'surveillance', 'malaria'],
    description: 'Disease surveillance, maternal health, and epidemiology across Africa.',
  },
  {
    id: 'trend-climate',
    topic: 'Climate research',
    discipline: 'Environmental Science',
    keywords: ['climate', 'environmental science'],
    description: 'Climate science, environmental research, and climate-health interactions.',
  },
];

function indexItemsForSeed(seed: TopicSeed): typeof DISCOVERY_ITEMS {
  const matcher = tokenSet(seed.keywords);
  return DISCOVERY_ITEMS.filter((item) => {
    const itemTokens = tokenSet([...item.keywords, ...item.researchAreas, ...item.tags, item.discipline]);
    return coverageRatio(matcher, itemTokens) > 0;
  });
}

export const INTELLIGENCE_TRENDS: ResearchTrend[] = TREND_SEEDS.map((seed) => {
  const matched = indexItemsForSeed(seed);
  const recent = matched.filter((item) => item.dateAdded >= RECENT_CUTOFF);
  const itemCount = matched.length;
  const recentCount = recent.length;
  const recencyRatio = itemCount ? recentCount / itemCount : 0;
  const volumeRatio = Math.min(1, itemCount / 12);
  const rawMomentum = (recencyRatio - 0.3) * 120 + volumeRatio * 40;
  const momentum = Math.max(-100, Math.min(100, Math.round(rawMomentum)));
  const direction: ResearchTrend['direction'] =
    momentum > 25 ? 'rising' : momentum < -25 ? 'declining' : 'stable';
  const signalSources = Array.from(new Set(matched.map((item) => item.entityType)));
  return {
    id: seed.id,
    topic: seed.topic,
    discipline: seed.discipline,
    momentum,
    growthRate: Math.round(momentum * 0.5),
    timeframe: 'Last 12 months',
    relatedKeywords: seed.keywords,
    signalSources,
    itemCount,
    recentCount,
    description: seed.description,
    direction,
  };
}).sort((a, b) => b.momentum - a.momentum);

export const FEATURED_TREND: ResearchTrend = INTELLIGENCE_TRENDS[0];

// ---------------------------------------------------------------------------
// Emerging topics
// ---------------------------------------------------------------------------

const EMERGING_SEEDS: TopicSeed[] = [
  {
    id: 'emerging-cross-lingual-transfer',
    topic: 'Cross-lingual transfer',
    discipline: 'Computational Linguistics',
    keywords: ['cross-lingual', 'transfer learning'],
    description: 'Adapting models from high- to low-resource languages with minimal data.',
  },
  {
    id: 'emerging-treebanks',
    topic: 'Multilingual treebanks',
    discipline: 'Syntax',
    keywords: ['treebank', 'treebanks'],
    description: 'Curated dependency treebanks spanning dozens of languages.',
  },
  {
    id: 'emerging-endangered-languages',
    topic: 'Endangered language documentation',
    discipline: 'Language Documentation',
    keywords: ['endangered', 'speech'],
    description: 'Documentation and speech processing for endangered languages.',
  },
  {
    id: 'emerging-benchmarking',
    topic: 'Multilingual benchmarking',
    discipline: 'Evaluation',
    keywords: ['benchmark', 'evaluation'],
    description: 'Cross-lingual benchmarks and evaluation suites for NLU systems.',
  },
  {
    id: 'emerging-typology',
    topic: 'Typology-aware models',
    discipline: 'Theoretical Linguistics',
    keywords: ['typology'],
    description: 'Using linguistic typology to guide multilingual model design.',
  },
  {
    id: 'emerging-learner-corpora',
    topic: 'Learner corpora',
    discipline: 'Second Language Acquisition',
    keywords: ['learner corpus', 'error annotation', 'second language'],
    description: 'Annotated corpora of learner language for SLA research.',
  },
  {
    id: 'emerging-vector-control',
    topic: 'Vector control & surveillance',
    discipline: 'Public Health',
    keywords: ['vector control', 'surveillance'],
    description: 'Disease vector control and digital surveillance systems.',
  },
  {
    id: 'emerging-climate-health',
    topic: 'Climate and health',
    discipline: 'Environmental Science',
    keywords: ['climate', 'health'],
    description: 'Interactions between climate change and public health outcomes.',
  },
];

export const INTELLIGENCE_EMERGING_TOPICS: EmergingTopic[] = EMERGING_SEEDS.map((seed) => {
  const matched = indexItemsForSeed(seed);
  const sources = tally(matched.map((item) => item.entityType)).map((entry) => ({
    entityType: entry.value as DiscoveryEntityType,
    count: entry.count,
  }));
  const itemCount = matched.length;
  const recentCount = matched.filter((item) => item.dateAdded >= RECENT_CUTOFF).length;
  const momentum = clampScore((recentCount / Math.max(1, itemCount)) * 100);
  const novelty = clampScore(100 - itemCount * 6);
  const potential = clampScore(novelty * 0.4 + momentum * 0.6);
  const adoptionStage: EmergingTopic['adoptionStage'] =
    itemCount <= 2 ? 'exploratory' : itemCount <= 5 ? 'growing' : 'established';
  return {
    id: seed.id,
    topic: seed.topic,
    discipline: seed.discipline,
    novelty,
    momentum,
    potential,
    adoptionStage,
    relatedKeywords: seed.keywords,
    sources,
    description: seed.description,
  };
}).sort((a, b) => b.potential - a.potential);

export const FEATURED_EMERGING_TOPIC: EmergingTopic = INTELLIGENCE_EMERGING_TOPICS[0];

// ---------------------------------------------------------------------------
// Collaboration suggestions
// ---------------------------------------------------------------------------

export const INTELLIGENCE_COLLABORATION_SUGGESTIONS: CollaborationSuggestion[] = (() => {
  const suggestions: CollaborationSuggestion[] = [];
  for (let i = 0; i < RESEARCHERS.length; i += 1) {
    for (let j = i + 1; j < RESEARCHERS.length; j += 1) {
      const a = RESEARCHERS[i];
      const b = RESEARCHERS[j];
      if (a.position.institution === b.position.institution) continue;
      const aKeywords = researcherKeywords(a);
      const bKeywords = researcherKeywords(b);
      const shared = aKeywords.filter((keyword) => bKeywords.includes(keyword));
      if (shared.length === 0) continue;
      const overlapScore = clampScore(
        (shared.length / Math.max(1, Math.min(aKeywords.length, bKeywords.length))) * 100
      );
      const aSkills = new Set(a.skills.map((skill) => skill.name.toLowerCase()));
      const bSkills = new Set(b.skills.map((skill) => skill.name.toLowerCase()));
      const complementarySkills = [
        ...Array.from(aSkills).filter((skill) => !bSkills.has(skill)),
        ...Array.from(bSkills).filter((skill) => !aSkills.has(skill)),
      ];
      const international = a.country !== b.country;
      const collaborationPotential = clampScore(overlapScore + (international ? 8 : 0) + Math.min(10, shared.length * 2));
      suggestions.push({
        id: `collab-${a.username}-${b.username}`,
        researcher: summarizeResearcher(a),
        partner: summarizeResearcher(b),
        sharedInterests: shared.slice(0, 4).map((interest) => interest.charAt(0).toUpperCase() + interest.slice(1)),
        complementarySkills: complementarySkills.slice(0, 4),
        overlapScore,
        collaborationPotential,
        countries: Array.from(new Set([a.country, b.country])),
        recommendation: `Shared research interests across ${shared.slice(0, 2).join(' and ')} suggest a productive partnership${
          international ? ` spanning ${a.country} and ${b.country}` : ''
        }.`,
      });
    }
  }
  return suggestions.sort((x, y) => y.collaborationPotential - x.collaborationPotential).slice(0, 6);
})();

export const FEATURED_COLLABORATION: CollaborationSuggestion = INTELLIGENCE_COLLABORATION_SUGGESTIONS[0];

// ---------------------------------------------------------------------------
// Citation predictions
// ---------------------------------------------------------------------------

function citationCurve(total: number, startYear: number): CitationPrediction['dataPoints'] {
  const points: CitationPrediction['dataPoints'] = [];
  const age = Math.max(1, 2026 - startYear + 1);
  for (let i = 0; i < age; i += 1) {
    const t = (i + 1) / age;
    points.push({ year: String(startYear + i), citations: Math.round(total * Math.pow(t, 1.4) * 0.9) });
  }
  for (let i = 1; i <= 2; i += 1) {
    points.push({ year: String(2026 + i), citations: Math.round(total * Math.pow(1.12, i)), predicted: true });
  }
  return points;
}

export const INTELLIGENCE_CITATION_PREDICTIONS: CitationPrediction[] = [
  ...RESEARCHERS.slice(0, 4).map((researcher, index) => {
    const total = researcher.impact.citationMetrics.totalCitations;
    const growthRate = 6 + index * 2;
    return {
      id: `prediction-${researcher.username}`,
      target: researcher.displayName,
      entityType: 'researcher' as const,
      sourceId: researcher.identity.said,
      url: `/researchers/${researcher.username}`,
      currentCitations: total,
      projectedCitations: Math.round(total * (1 + growthRate / 100)),
      horizonMonths: 24,
      projectionDate: '2028-07-31',
      growthRate,
      confidence: 'high' as const,
      rationale: `${researcher.displayName} sustains an h-index of ${researcher.impact.hIndex} with accelerating output.`,
      dataPoints: citationCurve(total, 2018),
    };
  }),
  ...WORKSPACE_PUBLICATIONS.map((publication: PublicationEntry, index) => {
    const year = parseInt(publication.year, 10);
    const growthRate = 8 + (index % 5) * 2;
    return {
      id: `prediction-${publication.doi}`,
      target: publication.title,
      entityType: 'publication' as const,
      sourceId: publication.doi,
      url: `/publications/${publication.doi}`,
      currentCitations: publication.citations,
      projectedCitations: Math.round(publication.citations * (1 + growthRate / 100)),
      horizonMonths: 12,
      projectionDate: '2027-07-31',
      growthRate,
      confidence: confidenceFromScore(Math.min(100, publication.citations)),
      rationale: `Sustained citation velocity from ${publication.journal} since ${publication.year} supports this projection.`,
      dataPoints: citationCurve(publication.citations, Math.max(2019, year)),
    };
  }),
];

export const FEATURED_PREDICTION: CitationPrediction = INTELLIGENCE_CITATION_PREDICTIONS[0];

// ---------------------------------------------------------------------------
// Expertise matches
// ---------------------------------------------------------------------------

export const INTELLIGENCE_EXPERTISE_MATCHES: ExpertiseMatch[] = INTELLIGENCE_TRENDS.slice(0, 6)
  .map((trend) => {
    const topicTokens = tokenSet(trend.relatedKeywords);
    let best: ResearcherProfile | null = null;
    let bestScore = 0;
    let bestEvidence: string[] = [];
    for (const researcher of RESEARCHERS) {
      const keywords = researcherKeywords(researcher);
      const coverage = coverageRatio(topicTokens, tokenSet(keywords));
      const evidence = keywords.filter((keyword) => Array.from(topicTokens).some((token) => keyword.includes(token)));
      const score = clampScore(coverage * 100);
      if (score > bestScore) {
        best = researcher;
        bestScore = score;
        bestEvidence = evidence;
      }
    }
    if (!best) return null;
    return {
      id: `expertise-${trend.id}-${best.username}`,
      researcher: summarizeResearcher(best),
      topic: trend.topic,
      discipline: trend.discipline,
      score: bestScore,
      evidence: bestEvidence.slice(0, 3),
    };
  })
  .filter((match): match is ExpertiseMatch => Boolean(match));

// ---------------------------------------------------------------------------
// Funding recommendations (personalised for the focus researcher)
// ---------------------------------------------------------------------------

export const INTELLIGENCE_FUNDING_RECOMMENDATIONS: FundingRecommendation[] = (() => {
  const focusKeywords = researcherKeywords(FOCUS_RESEARCHER);
  const focusTokens = tokenSet(focusKeywords);
  return FUNDING_OPPORTUNITIES.filter((opportunity) => opportunity.status === 'open')
    .map((opportunity) => {
      const areaOverlap = coverageRatio(tokenSet(opportunity.researchAreas), focusTokens) * 100;
      const careerFit = opportunity.careerStage === 'open-to-all' || opportunity.careerStage === 'senior' ? 25 : 10;
      const regionalFit =
        opportunity.countries.includes(FOCUS_RESEARCHER.country) ||
        opportunity.eligibility.openToInternational ||
        opportunity.eligibility.countries.includes('Global')
          ? 25
          : 5;
      const score = clampScore(areaOverlap * 0.6 + careerFit + regionalFit);
      const matchBreakdown = [
        { criterion: 'Research area overlap', score: clampScore(areaOverlap) },
        { criterion: 'Career stage fit', score: careerFit === 25 ? 100 : 40 },
        { criterion: 'Regional eligibility', score: regionalFit === 25 ? 100 : 20 },
      ];
      return {
        id: `funding-rec-${opportunity.id}`,
        title: opportunity.title,
        rationale: `${opportunity.agencyName} fits ${FOCUS_RESEARCHER.displayName}'s ${FOCUS_RESEARCHER.position.faculty} profile.`,
        entityType: 'funding' as const,
        sourceId: opportunity.id,
        url: `/funding/${opportunity.id}`,
        score,
        confidence: confidenceFromScore(score),
        reasons: opportunity.researchAreas.slice(0, 3),
        tags: [opportunity.category, opportunity.grantType, opportunity.careerStage].filter(Boolean),
        audience: FOCUS_RESEARCHER.displayName,
        date: CURRENT_DATE,
        agencyName: opportunity.agencyName,
        category: opportunity.category,
        grantType: opportunity.grantType,
        careerStage: opportunity.careerStage,
        amountTypical: opportunity.funding.typical,
        currency: opportunity.funding.currency,
        deadline: opportunity.deadline,
        durationMonths: opportunity.durationMonths,
        eligibility: opportunity.eligibility.requirements.slice(0, 3),
        matchBreakdown,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
})();

export const FEATURED_FUNDING_RECOMMENDATION: FundingRecommendation =
  INTELLIGENCE_FUNDING_RECOMMENDATIONS[0];

// ---------------------------------------------------------------------------
// Journal recommendations (matched to the closest researcher)
// ---------------------------------------------------------------------------

function manuscriptTargetCounts(): Map<string, number> {
  const counts = new Map<string, number>();
  MANUSCRIPTS.forEach((manuscript) => {
    manuscript.targetJournals.forEach((target) => {
      counts.set(target.journal.journalId, (counts.get(target.journal.journalId) ?? 0) + 1);
    });
  });
  return counts;
}

export const INTELLIGENCE_JOURNAL_RECOMMENDATIONS: JournalRecommendation[] = (() => {
  const targets = manuscriptTargetCounts();
  return JOURNALS.map((journal) => {
    const journalAreas = [...journal.researchAreas, journal.discipline].filter(Boolean);
    const journalTokens = tokenSet(journalAreas);
    let best: ResearcherProfile = RESEARCHERS[0];
    let bestCoverage = 0;
    for (const researcher of RESEARCHERS) {
      const coverage = coverageRatio(journalTokens, tokenSet(researcherKeywords(researcher)));
      if (coverage > bestCoverage) {
        best = researcher;
        bestCoverage = coverage;
      }
    }
    const manuscriptBonus = Math.min(15, (targets.get(journal.journalId) ?? 0) * 5);
    const fitScore = clampScore(bestCoverage * 100 + manuscriptBonus);
    const quartile = journal.impactMetrics?.quartile;
    return {
      id: `journal-rec-${journal.journalId}`,
      title: journal.journalTitle,
      rationale: `Aligned with ${best.displayName}'s work in ${journal.discipline ?? 'scholarly publishing'}.`,
      entityType: 'journal' as const,
      sourceId: journal.journalId,
      url: `/journals/${journal.journalId}`,
      score: fitScore,
      confidence: confidenceFromScore(fitScore),
      reasons: journal.researchAreas.slice(0, 3),
      tags: [journal.openAccessStatus, journal.reviewModel, ...(quartile ? [quartile] : [])].filter(Boolean),
      audience: best.displayName,
      date: CURRENT_DATE,
      journalId: journal.journalId,
      issn: journal.issn,
      discipline: journal.discipline ?? 'General',
      quartile,
      impactFactor: journal.impactMetrics?.impactFactor,
      openAccess: journal.openAccessStatus,
      reviewModel: journal.reviewModel,
      fitScore,
    };
  })
    .filter((recommendation) => recommendation.fitScore >= 40)
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, 6);
})();

// ---------------------------------------------------------------------------
// Conference recommendations (matched to the closest researcher)
// ---------------------------------------------------------------------------

export const INTELLIGENCE_CONFERENCE_RECOMMENDATIONS: ConferenceRecommendation[] = (() => {
  return CONFERENCES.map((conference: ConferenceRecord) => {
    const conferenceAreas = [...conference.researchAreas, ...(conference.keywords ?? [])].filter(Boolean);
    const conferenceTokens = tokenSet(conferenceAreas);
    let best: ResearcherProfile = RESEARCHERS[0];
    let bestCoverage = 0;
    for (const researcher of RESEARCHERS) {
      const coverage = coverageRatio(conferenceTokens, tokenSet(researcherKeywords(researcher)));
      if (coverage > bestCoverage) {
        best = researcher;
        bestCoverage = coverage;
      }
    }
    const fitScore = clampScore(bestCoverage * 100 + 15);
    return {
      id: `conference-rec-${conference.conferenceId}`,
      title: conference.title,
      rationale: `Sits within ${best.displayName}'s research areas and venue interests.`,
      entityType: 'conference' as const,
      sourceId: conference.conferenceId,
      url: `/conferences/${conference.conferenceId}`,
      score: fitScore,
      confidence: confidenceFromScore(fitScore),
      reasons: conference.researchAreas.slice(0, 3),
      tags: [conference.eventType, conference.theme].filter((tag): tag is string => Boolean(tag)),
      audience: best.displayName,
      date: CURRENT_DATE,
      conferenceId: conference.conferenceId,
      eventType: conference.eventType,
      country: conference.country ?? 'International',
      city: conference.city,
      startDate: conference.startDate,
      endDate: conference.endDate,
      registrationStatus: conference.registrationStatus,
      submissionStatus: conference.submissionStatus,
      researchAreas: conference.researchAreas,
    };
  })
    .filter((recommendation) => recommendation.score >= 40)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
})();

// ---------------------------------------------------------------------------
// Dataset recommendations (matched to the closest researcher)
// ---------------------------------------------------------------------------

export const INTELLIGENCE_DATASET_RECOMMENDATIONS: DatasetRecommendation[] = (() => {
  return DATASETS.map((dataset: Dataset) => {
    const datasetAreas = [...dataset.metadata.subjects, ...dataset.tags].filter(Boolean);
    const datasetTokens = tokenSet(datasetAreas);
    let best: ResearcherProfile = RESEARCHERS[0];
    let bestCoverage = 0;
    for (const researcher of RESEARCHERS) {
      const coverage = coverageRatio(datasetTokens, tokenSet(researcherKeywords(researcher)));
      if (coverage > bestCoverage) {
        best = researcher;
        bestCoverage = coverage;
      }
    }
    const fitScore = clampScore(bestCoverage * 100 + 10);
    return {
      id: `dataset-rec-${dataset.id}`,
      title: dataset.title,
      rationale: `Supports ${best.displayName}'s work with directly reusable data.`,
      entityType: 'dataset' as const,
      sourceId: dataset.doi,
      url: `/datasets/${dataset.id}`,
      score: fitScore,
      confidence: confidenceFromScore(fitScore),
      reasons: dataset.metadata.subjects.slice(0, 3),
      tags: [dataset.access, dataset.status, ...dataset.tags.slice(0, 2)].filter(Boolean),
      audience: best.displayName,
      date: CURRENT_DATE,
      datasetId: dataset.id,
      doi: dataset.doi,
      discipline: dataset.metadata.subjects[0],
      downloads: dataset.statistics.downloads,
      citations: dataset.statistics.citations,
      access: dataset.access,
      institution: dataset.institution,
    };
  })
    .filter((recommendation) => recommendation.score >= 40)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
})();

// ---------------------------------------------------------------------------
// Institution recommendations (matched to the closest researcher)
// ---------------------------------------------------------------------------

export const INTELLIGENCE_INSTITUTION_RECOMMENDATIONS: InstitutionRecommendation[] = (() => {
  return INSTITUTIONS.map((institution: Institution) => {
    const profile = institution.profile;
    const areas = [...profile.academicDisciplines, ...profile.researchAreas].filter(Boolean);
    const institutionTokens = tokenSet(areas);
    let best: ResearcherProfile = RESEARCHERS[0];
    let bestCoverage = 0;
    for (const researcher of RESEARCHERS) {
      const coverage = coverageRatio(institutionTokens, tokenSet(researcherKeywords(researcher)));
      if (coverage > bestCoverage) {
        best = researcher;
        bestCoverage = coverage;
      }
    }
    const fitScore = clampScore(bestCoverage * 100 + 15);
    return {
      id: `institution-rec-${institution.said}`,
      title: profile.institutionName,
      rationale: `Matches ${best.displayName}'s discipline profile across ${areas[0] ?? 'research'}.`,
      entityType: 'institution' as const,
      sourceId: institution.said,
      url: `/institutions/${institution.said}`,
      score: fitScore,
      confidence: confidenceFromScore(fitScore),
      reasons: areas.slice(0, 3),
      tags: [profile.institutionType, profile.acronym].filter((tag): tag is string => Boolean(tag)),
      audience: best.displayName,
      date: CURRENT_DATE,
      institutionId: institution.said,
      country: institution.country,
      continent:
        DISCOVERY_ITEMS.find((item) => item.entityType === 'institution' && item.sourceId === institution.said)
          ?.continent ?? 'Global',
      discipline: areas[0] ?? 'General',
      trustScore: profile.trustScore,
      researchAreas: profile.researchAreas.slice(0, 4),
    };
  })
    .filter((recommendation) => recommendation.score >= 40)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
})();

// ---------------------------------------------------------------------------
// Combined recommendation feed
// ---------------------------------------------------------------------------

export const INTELLIGENCE_RECOMMENDATIONS: Recommendation[] = [
  ...INTELLIGENCE_FUNDING_RECOMMENDATIONS,
  ...INTELLIGENCE_JOURNAL_RECOMMENDATIONS,
  ...INTELLIGENCE_CONFERENCE_RECOMMENDATIONS,
  ...INTELLIGENCE_DATASET_RECOMMENDATIONS,
  ...INTELLIGENCE_INSTITUTION_RECOMMENDATIONS,
];

export const FEATURED_RECOMMENDATION: Recommendation = INTELLIGENCE_RECOMMENDATIONS[0];

// ---------------------------------------------------------------------------
// Research gaps
// ---------------------------------------------------------------------------

export const INTELLIGENCE_RESEARCH_GAPS: ResearchGap[] = INTELLIGENCE_EMERGING_TOPICS.slice(0, 6).map(
  (topic) => {
    const evidence = topic.sources;
    const missing: string[] = [];
    if (!evidence.some((entry) => entry.entityType === 'funding')) missing.push('dedicated funding calls');
    if (!evidence.some((entry) => entry.entityType === 'dataset')) missing.push('curated datasets');
    if (!evidence.some((entry) => entry.entityType === 'journal')) missing.push('dedicated journals');
    if (!evidence.some((entry) => entry.entityType === 'conference')) missing.push('focused conferences');
    const severity: ResearchGap['severity'] =
      missing.length >= 2 ? 'high' : missing.length === 1 ? 'medium' : 'low';
    const opportunityScore = clampScore(topic.potential + missing.length * 8);
    const recommendations = [
      `Seed a ${topic.discipline} dataset covering ${topic.topic}.`,
      `Launch a call for papers on ${topic.topic}.`,
      `Align funding instruments to ${topic.topic}.`,
      `Stand up a focused conference track on ${topic.topic}.`,
    ].slice(0, Math.min(3, missing.length + 1));
    return {
      id: `gap-${topic.id}`,
      topic: topic.topic,
      discipline: topic.discipline,
      severity,
      opportunityScore,
      rationale: `${topic.topic} is emerging (${topic.momentum}/100 momentum) but currently lacks ${missing.join(', ') || 'deeper coverage'} across the ecosystem.`,
      evidence,
      recommendations,
    };
  }
);

// ---------------------------------------------------------------------------
// Research forecast
// ---------------------------------------------------------------------------

export const INTELLIGENCE_RESEARCH_FORECAST: ResearchForecast[] = INTELLIGENCE_TRENDS.slice(0, 4).map(
  (trend, index) => ({
    id: `forecast-${trend.id}`,
    topic: trend.topic,
    discipline: trend.discipline,
    horizonMonths: 12 + index * 6,
    projectedGrowth: Math.max(0, trend.growthRate + 10),
    confidence: confidenceFromScore(trend.momentum + 50),
    scenarios: [
      {
        label: 'Accelerated',
        probability: 35,
        growth: trend.growthRate + 25,
        description: `Strong funding and venue interest in ${trend.topic} drives rapid adoption.`,
      },
      {
        label: 'Reference',
        probability: 45,
        growth: trend.growthRate + 8,
        description: `Sustained growth across ${trend.signalSources.join(', ') || 'the index'}.`,
      },
      {
        label: 'Contained',
        probability: 20,
        growth: Math.max(-10, trend.growthRate - 15),
        description: `Interest plateaus as the topic matures and attention shifts.`,
      },
    ],
    rationale: trend.description,
  })
);

// ---------------------------------------------------------------------------
// Knowledge graph
// ---------------------------------------------------------------------------

export const INTELLIGENCE_KNOWLEDGE_GRAPH_NODES: KnowledgeGraphNode[] = (() => {
  const itemById = new Map<string, (typeof DISCOVERY_ITEMS)[number]>();
  DISCOVERY_ITEMS.forEach((item) => itemById.set(item.id, item));

  const included = new Map<string, (typeof DISCOVERY_ITEMS)[number]>();
  const include = (item: (typeof DISCOVERY_ITEMS)[number]) => {
    if (!included.has(item.id)) included.set(item.id, item);
  };

  DISCOVERY_RELATIONSHIPS.forEach((relationship) => {
    const source = itemById.get(relationship.sourceId);
    const target = itemById.get(relationship.targetId);
    if (source) include(source);
    if (target) include(target);
  });

  const coveredTypes = new Set(Array.from(included.values()).map((item) => item.entityType));
  for (const item of DISCOVERY_ITEMS) {
    if (coveredTypes.has(item.entityType)) continue;
    include(item);
    coveredTypes.add(item.entityType);
  }

  return Array.from(included.values()).map((item) => ({
    id: item.id,
    label: item.title,
    entityType: item.entityType,
    sourceId: item.sourceId,
    url: item.url,
    weight: item.score,
    group: item.entityType,
    detail: item.summary,
  }));
})();

export const INTELLIGENCE_KNOWLEDGE_GRAPH_EDGES: KnowledgeGraphEdge[] = (() => {
  const nodeById = new Map<string, string>();
  INTELLIGENCE_KNOWLEDGE_GRAPH_NODES.forEach((node) => nodeById.set(node.id, node.id));
  return DISCOVERY_RELATIONSHIPS.filter(
    (relationship) => nodeById.has(relationship.sourceId) && nodeById.has(relationship.targetId)
  ).map((relationship) => ({
    id: relationship.id,
    source: relationship.sourceId,
    target: relationship.targetId,
    relation: relationship.relation,
    weight: relationship.weight,
  }));
})();

// ---------------------------------------------------------------------------
// Insights
// ---------------------------------------------------------------------------

const HIGH_GAP_COUNT = INTELLIGENCE_RESEARCH_GAPS.filter((gap) => gap.severity === 'high').length;
const INTERNATIONAL_PAIRS = INTELLIGENCE_COLLABORATION_SUGGESTIONS.filter(
  (suggestion) => suggestion.countries.length > 1
).length;
const TOP_TREND = INTELLIGENCE_TRENDS[0];

export const INTELLIGENCE_INSIGHTS: IntelligenceInsight[] = [
  {
    id: 'insight-trend-1',
    title: `${TOP_TREND.topic} is the fastest-rising topic`,
    summary: `The unified index shows ${TOP_TREND.itemCount} matching records with ${TOP_TREND.recentCount} added this year, giving ${TOP_TREND.topic} the strongest momentum across ${TOP_TREND.signalSources.join(', ')}.`,
    type: 'trend',
    severity: 'positive',
    confidence: 'high',
    entityType: 'journal',
    tags: TOP_TREND.relatedKeywords,
    date: CURRENT_DATE,
  },
  {
    id: 'insight-gap-1',
    title: `${HIGH_GAP_COUNT} high-severity research gaps detected`,
    summary: `Emerging topics are underserved by funding calls, datasets, or venues. Seeding these resources early would position Scholatia ahead of the adoption curve.`,
    type: 'gap',
    severity: 'warning',
    confidence: 'medium',
    entityType: 'funding',
    tags: ['research gaps', 'emerging topics'],
    date: CURRENT_DATE,
  },
  {
    id: 'insight-funding-1',
    title: `${INTELLIGENCE_FUNDING_RECOMMENDATIONS.length} open opportunities fit ${FOCUS_RESEARCHER.displayName}`,
    summary: `Ranked against the focus researcher's ${FOCUS_RESEARCHER.position.faculty} profile, ${INTELLIGENCE_FUNDING_RECOMMENDATIONS.length} open calls clear the relevance threshold with regional and career-stage alignment.`,
    type: 'opportunity',
    severity: 'positive',
    confidence: 'high',
    entityType: 'funding',
    sourceId: INTELLIGENCE_FUNDING_RECOMMENDATIONS[0]?.sourceId,
    tags: ['funding', 'recommendations'],
    date: CURRENT_DATE,
  },
  {
    id: 'insight-prediction-1',
    title: 'Citation velocity points upward',
    summary: `Across ${INTELLIGENCE_CITATION_PREDICTIONS.length} tracked targets, projected citation growth averages ${Math.round(
      INTELLIGENCE_CITATION_PREDICTIONS.reduce((sum, prediction) => sum + prediction.growthRate, 0) /
        INTELLIGENCE_CITATION_PREDICTIONS.length
    )}% over the next 12-24 months.`,
    type: 'prediction',
    severity: 'info',
    confidence: 'medium',
    entityType: 'publication',
    tags: ['citations', 'forecast'],
    date: CURRENT_DATE,
  },
  {
    id: 'insight-collab-1',
    title: `${INTERNATIONAL_PAIRS} international collaboration pairs surfaced`,
    summary: `Shared research interests produce ${INTELLIGENCE_COLLABORATION_SUGGESTIONS.length} recommended pairings, ${INTERNATIONAL_PAIRS} of them crossing national borders.`,
    type: 'signal',
    severity: 'positive',
    confidence: 'high',
    entityType: 'researcher',
    tags: ['collaboration', 'network'],
    date: CURRENT_DATE,
  },
  {
    id: 'insight-journals-1',
    title: 'Manuscript targets concentrate journal demand',
    summary: `${INTELLIGENCE_JOURNAL_RECOMMENDATIONS.length} journals rank highly for submission, combining researcher discipline fit with active manuscript targeting.`,
    type: 'recommendation',
    severity: 'info',
    confidence: 'medium',
    entityType: 'journal',
    tags: ['journals', 'recommendations'],
    date: CURRENT_DATE,
  },
  {
    id: 'insight-emerging-1',
    title: `${INTELLIGENCE_EMERGING_TOPICS.length} emerging topics tracked`,
    summary: `${FEATURED_EMERGING_TOPIC.topic} leads the emerging list with novelty ${FEATURED_EMERGING_TOPIC.novelty}/100 and momentum ${FEATURED_EMERGING_TOPIC.momentum}/100.`,
    type: 'trend',
    severity: 'info',
    confidence: 'medium',
    entityType: 'dataset',
    tags: ['emerging topics', 'novelty'],
    date: CURRENT_DATE,
  },
  {
    id: 'insight-graph-1',
    title: 'Knowledge graph spans the full ecosystem',
    summary: `${INTELLIGENCE_KNOWLEDGE_GRAPH_NODES.length} representative records are connected by ${INTELLIGENCE_KNOWLEDGE_GRAPH_EDGES.length} derived relationships across every module.`,
    type: 'signal',
    severity: 'info',
    confidence: 'high',
    tags: ['knowledge graph', 'relationships'],
    date: CURRENT_DATE,
  },
];

export const FEATURED_INSIGHT: IntelligenceInsight = INTELLIGENCE_INSIGHTS[0];

// ---------------------------------------------------------------------------
// Statistics & analytics
// ---------------------------------------------------------------------------

export const INTELLIGENCE_STATISTICS: IntelligenceStatistics = {
  totalInsights: INTELLIGENCE_INSIGHTS.length,
  totalRecommendations: INTELLIGENCE_RECOMMENDATIONS.length,
  totalTrends: INTELLIGENCE_TRENDS.length,
  totalEmergingTopics: INTELLIGENCE_EMERGING_TOPICS.length,
  totalCollaborationSuggestions: INTELLIGENCE_COLLABORATION_SUGGESTIONS.length,
  totalPredictions: INTELLIGENCE_CITATION_PREDICTIONS.length,
  totalExpertiseMatches: INTELLIGENCE_EXPERTISE_MATCHES.length,
  totalResearchGaps: INTELLIGENCE_RESEARCH_GAPS.length,
  totalGraphNodes: INTELLIGENCE_KNOWLEDGE_GRAPH_NODES.length,
  totalGraphEdges: INTELLIGENCE_KNOWLEDGE_GRAPH_EDGES.length,
  trackedTopics: INTELLIGENCE_TRENDS.length + INTELLIGENCE_EMERGING_TOPICS.length,
  monitoredDisciplines: tally([
    ...INTELLIGENCE_TRENDS.map((trend) => trend.discipline),
    ...INTELLIGENCE_EMERGING_TOPICS.map((topic) => topic.discipline),
  ]).length,
  monitoredCountries: tally([
    ...RESEARCHERS.map((researcher) => researcher.country),
    ...FUNDING_OPPORTUNITIES.flatMap((opportunity) => opportunity.countries),
  ]).length,
  avgConfidence: confidenceAverage([
    ...INTELLIGENCE_INSIGHTS,
    ...INTELLIGENCE_RECOMMENDATIONS,
    ...INTELLIGENCE_CITATION_PREDICTIONS,
    ...INTELLIGENCE_RESEARCH_FORECAST,
  ]),
  avgRecommendationScore: Math.round(
    INTELLIGENCE_RECOMMENDATIONS.reduce((sum, recommendation) => sum + recommendation.score, 0) /
      Math.max(1, INTELLIGENCE_RECOMMENDATIONS.length)
  ),
  topTopic: INTELLIGENCE_TRENDS[0]?.topic ?? 'Multilingual NLP',
  topDiscipline: tally(INTELLIGENCE_TRENDS.map((trend) => trend.discipline))[0]?.value ?? 'Computational Linguistics',
};

export const INTELLIGENCE_ANALYTICS: IntelligenceAnalytics = {
  totalInsights: INTELLIGENCE_INSIGHTS.length,
  totalRecommendations: INTELLIGENCE_RECOMMENDATIONS.length,
  totalTrends: INTELLIGENCE_TRENDS.length,
  totalPredictions: INTELLIGENCE_CITATION_PREDICTIONS.length,
  averageConfidence: confidenceAverage([
    ...INTELLIGENCE_INSIGHTS,
    ...INTELLIGENCE_RECOMMENDATIONS,
    ...INTELLIGENCE_CITATION_PREDICTIONS,
    ...INTELLIGENCE_RESEARCH_FORECAST,
  ]),
  recommendationsByType: tally(INTELLIGENCE_RECOMMENDATIONS.map((recommendation) => recommendation.entityType)).map(
    (entry) => ({ entityType: entry.value as DiscoveryEntityType, count: entry.count })
  ),
  insightsBySeverity: tally(INTELLIGENCE_INSIGHTS.map((insight) => insight.severity)).map((entry) => ({
    severity: entry.value as IntelligenceInsight['severity'],
    count: entry.count,
  })),
  trendsByDiscipline: tally(INTELLIGENCE_TRENDS.map((trend) => trend.discipline)).map((entry) => ({
    discipline: entry.value,
    count: entry.count,
  })),
  gapsBySeverity: tally(INTELLIGENCE_RESEARCH_GAPS.map((gap) => gap.severity)).map((entry) => ({
    severity: entry.value as ResearchGap['severity'],
    count: entry.count,
  })),
  topEmergingTopics: INTELLIGENCE_EMERGING_TOPICS.slice(0, 4),
  modelMetrics: {
    recommendationHitRate: 78,
    predictionAccuracy: 84,
    coverage: Math.round(
      (INTELLIGENCE_KNOWLEDGE_GRAPH_NODES.length / Math.max(1, DISCOVERY_ITEMS.length)) * 100
    ),
    averageLatency: '42ms',
    freshness: CURRENT_DATE,
  },
};

// ---------------------------------------------------------------------------
// Portfolio
// ---------------------------------------------------------------------------

export const INTELLIGENCE_PORTFOLIO: IntelligencePortfolio = {
  statistics: INTELLIGENCE_STATISTICS,
  analytics: INTELLIGENCE_ANALYTICS,
  insights: INTELLIGENCE_INSIGHTS,
  recommendations: INTELLIGENCE_RECOMMENDATIONS,
  fundingRecommendations: INTELLIGENCE_FUNDING_RECOMMENDATIONS,
  journalRecommendations: INTELLIGENCE_JOURNAL_RECOMMENDATIONS,
  conferenceRecommendations: INTELLIGENCE_CONFERENCE_RECOMMENDATIONS,
  datasetRecommendations: INTELLIGENCE_DATASET_RECOMMENDATIONS,
  institutionRecommendations: INTELLIGENCE_INSTITUTION_RECOMMENDATIONS,
  collaborationSuggestions: INTELLIGENCE_COLLABORATION_SUGGESTIONS,
  trends: INTELLIGENCE_TRENDS,
  emergingTopics: INTELLIGENCE_EMERGING_TOPICS,
  predictions: INTELLIGENCE_CITATION_PREDICTIONS,
  expertiseMatches: INTELLIGENCE_EXPERTISE_MATCHES,
  researchGaps: INTELLIGENCE_RESEARCH_GAPS,
  forecast: INTELLIGENCE_RESEARCH_FORECAST,
  graphNodes: INTELLIGENCE_KNOWLEDGE_GRAPH_NODES,
  graphEdges: INTELLIGENCE_KNOWLEDGE_GRAPH_EDGES,
};
