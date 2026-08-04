import type {
  ActivityKind,
  CompetencyFramework,
  LearningAcademy,
  LearningActivity,
  LearningAdaptiveRecommendation,
  LearningAnalytics,
  LearningAnnouncement,
  LearningAssessment,
  LearningBadge,
  LearningBookmark,
  LearningCertificate,
  LearningCompetencyHistoryEntry,
  LearningCourse,
  LearningCpdRecord,
  LearningDeadline,
  LearningEvent,
  LearningGoal,
  LearningHighlight,
  LearningHistoryEntry,
  LearningInstitution,
  LearningJournalEntry,
  LearningKpis,
  LearningLesson,
  LearningMentor,
  LearningMentorship,
  LearningModule,
  LearningNote,
  LearningPath,
  LearningPortfolio,
  LearningProgramme,
  LearningProgressEntry,
  LearningReading,
  LearningReadingList,
  LearningReadingPlaylist,
  LearningRubric,
  LearningStatistics,
  LearningTopic,
  PortfolioItem,
  ResearchLifecycleStageId,
} from '@/types/learning';
import type { ResearcherProfile } from '@/types/researcher';
import { RESEARCHERS } from '@/constants/placeholder-researchers';
import {
  academyId,
  activityId,
  advanceProgress,
  badgeId,
  buildLearningSlug,
  buildLearningAnalytics,
  competencyAttainment,
  competencyGapAnalysis,
  courseId,
  courseProgress,
  cpdRecordId,
  curriculumId,
  eventId,
  evidenceToLevels,
  gapRecommendations,
  goalId,
  historyEntryId,
  learningKpis,
  learningStatistics,
  lessonId,
  mentorshipId,
  moduleId,
  pathId,
  portfolioId,
  programmeId,
  recommendLearning,
  recommendMentors,
  topicId,
  verificationReferenceFor,
} from '@/lib/learning';

/**
 * Placeholder data for the Scholatia Learning Ecosystem (Phase 2.2G.3).
 *
 * The learning graph owns no external records: learners, instructors, and
 * mentors reference canonical researchers by `username`; institutions are
 * referenced by canonical ids (e.g. `INST-UI-001`); research exercises carry
 * the canonical `ResearchLifecycleStageId`. Statistics, KPIs, analytics,
 * competency gaps, recommendations, and mentor rankings are all derived from
 * the typed learning graph by the pure engine in `lib/learning.ts`.
 */

const CURRENT_USER = 'ojuri';
const NOW = new Date('2026-08-04T12:00:00.000Z');
const NOW_ISO = NOW.toISOString();

const D_MAR = '2026-03-18T10:00:00.000Z';
const D_MAY = '2026-05-12T10:00:00.000Z';
const D_JUN = '2026-06-20T10:00:00.000Z';
const D_JUL = '2026-07-25T10:00:00.000Z';

// ---------------------------------------------------------------------------
// Shared canonical references
// ---------------------------------------------------------------------------

function researcherOf(username: string): ResearcherProfile {
  const found = RESEARCHERS.find((researcher) => researcher.username === username);
  if (!found) {
    throw new Error(`Missing researcher seed: ${username}`);
  }
  return found;
}

const OJURI = researcherOf('ojuri');
const SMITH = researcherOf('smith');
const ADEBAYO = researcherOf('adebayo');
const MARIA = researcherOf('maria');
const TANAKA = researcherOf('tanaka');
const OKONKWO = researcherOf('okonkwo');
const DUBE = researcherOf('dube');
const SCHNEIDER = researcherOf('schneider');

// ---------------------------------------------------------------------------
// Tree builders
// ---------------------------------------------------------------------------

function activity(title: string, description: string, kind: ActivityKind, assessmentId?: string): LearningActivity {
  return {
    id: activityId(title),
    slug: buildLearningSlug(title),
    title,
    description,
    position: 0,
    kind,
    assessmentId,
    createdAt: NOW_ISO,
    updatedAt: NOW_ISO,
  };
}

function topic(title: string, description: string, activities: LearningActivity[]): LearningTopic {
  return {
    id: topicId(title),
    slug: buildLearningSlug(title),
    title,
    description,
    position: 0,
    activities: activities.map((item, index) => ({ ...item, position: index + 1 })),
    createdAt: NOW_ISO,
    updatedAt: NOW_ISO,
  };
}

function lesson(title: string, description: string, topics: LearningTopic[]): LearningLesson {
  return {
    id: lessonId(title),
    slug: buildLearningSlug(title),
    title,
    description,
    position: 0,
    topics: topics.map((item, index) => ({ ...item, position: index + 1 })),
    createdAt: NOW_ISO,
    updatedAt: NOW_ISO,
  };
}

function module(title: string, description: string, lessons: LearningLesson[]): LearningModule {
  return {
    id: moduleId(title),
    slug: buildLearningSlug(title),
    title,
    description,
    position: 0,
    lessons: lessons.map((item, index) => ({ ...item, position: index + 1 })),
    createdAt: NOW_ISO,
    updatedAt: NOW_ISO,
  };
}

// ---------------------------------------------------------------------------
// Rubrics
// ---------------------------------------------------------------------------

export const LEARNING_RUBRICS: LearningRubric[] = [
  {
    id: 'rub-research-proposal',
    title: 'Research Proposal Rubric',
    criteria: [
      { id: 'rpc-1', statement: 'Clarity of the research question', maxScore: 20 },
      { id: 'rpc-2', statement: 'Soundness of the methodology', maxScore: 30 },
      { id: 'rpc-3', statement: 'Feasibility and resourcing', maxScore: 25 },
      { id: 'rpc-4', statement: 'Expected contribution to knowledge', maxScore: 25 },
    ],
    createdAt: D_MAR,
    updatedAt: D_MAY,
  },
  {
    id: 'rub-academic-writing',
    title: 'Academic Writing Rubric',
    criteria: [
      { id: 'awc-1', statement: 'Argument and logical flow', maxScore: 30 },
      { id: 'awc-2', statement: 'Use of evidence and sources', maxScore: 30 },
      { id: 'awc-3', statement: 'Clarity and scholarly tone', maxScore: 20 },
      { id: 'awc-4', statement: 'Conventions and referencing', maxScore: 20 },
    ],
    createdAt: D_MAR,
    updatedAt: D_MAY,
  },
  {
    id: 'rub-data-analysis',
    title: 'Data Analysis Practical Rubric',
    criteria: [
      { id: 'dac-1', statement: 'Correct application of statistical methods', maxScore: 40 },
      { id: 'dac-2', statement: 'Reproducible code and documentation', maxScore: 30 },
      { id: 'dac-3', statement: 'Interpretation and reporting', maxScore: 30 },
    ],
    createdAt: D_MAR,
    updatedAt: D_MAY,
  },
  {
    id: 'rub-research-ethics',
    title: 'Research Ethics Case Rubric',
    criteria: [
      { id: 'ec-1', statement: 'Identification of ethical issues', maxScore: 40 },
      { id: 'ec-2', statement: 'Application of principles and guidance', maxScore: 30 },
      { id: 'ec-3', statement: 'Practical mitigation strategies', maxScore: 30 },
    ],
    createdAt: D_MAR,
    updatedAt: D_MAY,
  },
];

// ---------------------------------------------------------------------------
// Competency framework
// ---------------------------------------------------------------------------

export const SLE_COMPETENCY_FRAMEWORK: CompetencyFramework = {
  id: 'slf-competency-framework-v1',
  name: 'Scholarly Learning Competency Framework',
  description: 'Core competencies for early-career researchers across research, digital, teaching, and professional domains.',
  version: '1.0.0',
  levels: [
    { level: 1, name: 'Foundational' },
    { level: 2, name: 'Developing' },
    { level: 3, name: 'Competent' },
    { level: 4, name: 'Proficient' },
    { level: 5, name: 'Expert' },
  ],
  competencies: [
    {
      id: 'comp-research-design',
      key: 'research-design',
      name: 'Research Design',
      description: 'Formulating research questions and selecting sound study designs.',
      domain: 'research',
      frameworkId: 'slf-competency-framework-v1',
      targetLevel: 4,
      skills: ['question formulation', 'hypothesis testing', 'study design'],
      knowledgeAreas: ['research paradigms', 'methodology', 'sampling theory'],
      prerequisites: ['research-methods'],
    },
    {
      id: 'comp-research-methods',
      key: 'research-methods',
      name: 'Research Methods',
      description: 'Applying qualitative and quantitative methods rigorously.',
      domain: 'research',
      frameworkId: 'slf-competency-framework-v1',
      targetLevel: 3,
      skills: ['data collection', 'instrument design', 'method selection'],
      knowledgeAreas: ['research ethics', 'data management', 'measurement'],
      prerequisites: [],
    },
    {
      id: 'comp-literature-review',
      key: 'literature-review',
      name: 'Literature Review',
      description: 'Systematically searching, appraising, and synthesising literature.',
      domain: 'research',
      frameworkId: 'slf-competency-framework-v1',
      targetLevel: 4,
      skills: ['search strategy', 'critical appraisal', 'synthesis'],
      knowledgeAreas: ['bibliographic databases', 'systematic review methods'],
      prerequisites: ['research-methods'],
    },
    {
      id: 'comp-data-analysis',
      key: 'data-analysis',
      name: 'Data Analysis',
      description: 'Analysing data with appropriate statistical methods and tools.',
      domain: 'skills',
      frameworkId: 'slf-competency-framework-v1',
      targetLevel: 4,
      skills: ['statistical modelling', 'regression', 'interpretation'],
      knowledgeAreas: ['inferential statistics', 'reproducible analysis'],
      prerequisites: ['data-literacy'],
    },
    {
      id: 'comp-data-literacy',
      key: 'data-literacy',
      name: 'Data Literacy',
      description: 'Reading, managing, and curating research data responsibly.',
      domain: 'digital',
      frameworkId: 'slf-competency-framework-v1',
      targetLevel: 3,
      skills: ['data cleaning', 'data visualisation', 'data stewardship'],
      knowledgeAreas: ['data formats', 'FAIR principles', 'data governance'],
      prerequisites: [],
    },
    {
      id: 'comp-academic-writing',
      key: 'academic-writing',
      name: 'Academic Writing',
      description: 'Writing clear, persuasive scholarly prose for publication.',
      domain: 'skills',
      frameworkId: 'slf-competency-framework-v1',
      targetLevel: 4,
      skills: ['argumentation', 'manuscript structuring', 'revision'],
      knowledgeAreas: ['publication conventions', 'citation practice'],
      prerequisites: [],
    },
    {
      id: 'comp-grant-writing',
      key: 'grant-writing',
      name: 'Grant Writing',
      description: 'Developing competitive research funding proposals.',
      domain: 'research',
      frameworkId: 'slf-competency-framework-v1',
      targetLevel: 3,
      skills: ['proposal drafting', 'budgeting', 'impact framing'],
      knowledgeAreas: ['funding landscape', 'review criteria', 'project planning'],
      prerequisites: ['research-design', 'research-ethics'],
    },
    {
      id: 'comp-research-ethics',
      key: 'research-ethics',
      name: 'Research Ethics',
      description: 'Conducting research with integrity and institutional compliance.',
      domain: 'professional',
      frameworkId: 'slf-competency-framework-v1',
      targetLevel: 3,
      skills: ['consent design', 'risk mitigation', 'integrity practice'],
      knowledgeAreas: ['research governance', 'human subjects protection', 'authorship ethics'],
      prerequisites: [],
    },
    {
      id: 'comp-digital-skills',
      key: 'digital-skills',
      name: 'Digital Skills',
      description: 'Using digital tools for scholarly productivity and collaboration.',
      domain: 'digital',
      frameworkId: 'slf-competency-framework-v1',
      targetLevel: 3,
      skills: ['reference management', 'version control', 'scholarly tools'],
      knowledgeAreas: ['open science tools', 'digital workflows'],
      prerequisites: ['data-literacy'],
    },
    {
      id: 'comp-teaching',
      key: 'teaching',
      name: 'Teaching & Mentoring',
      description: 'Designing learning experiences and mentoring emerging researchers.',
      domain: 'teaching',
      frameworkId: 'slf-competency-framework-v1',
      targetLevel: 3,
      skills: ['lesson design', 'feedback practice', 'learner support'],
      knowledgeAreas: ['learning theory', 'assessment design'],
      prerequisites: ['academic-writing'],
    },
  ],
};

// ---------------------------------------------------------------------------
// Courses
// ---------------------------------------------------------------------------

export const RESEARCH_METHODS_QUIZ_ACTIVITY = activity(
  'Research Design Self-Check',
  'Ten-question quiz on research questions, designs, and sampling.',
  'exercise',
  'asm-research-design-quiz',
);

export const RESEARCH_METHODS_MODULE_ONE = module('Foundations of Research Design', 'From research questions to study designs in health research.', [
  lesson('From Research Question to Hypothesis', 'Crafting answerable questions and testable hypotheses.', [
    topic('Defining a Clear Research Question', 'The PICO framework and answerability.', [
      RESEARCH_METHODS_QUIZ_ACTIVITY,
      activity('Articulating a Hypothesis', 'Write a hypothesis for a given public-health problem.', 'task'),
    ]),
    topic('Aligning Objectives with Design', 'Linking objectives to design choices.', [
      activity('Objective Mapping Exercise', 'Match objectives to candidate study designs.', 'exercise'),
    ]),
  ]),
  lesson('Study Designs in Health Research', 'Observational and experimental designs compared.', [
    topic('Observational Study Designs', 'Cross-sectional, cohort, and case-control studies.', [
      activity('Design Comparison Table', 'Build a comparison table across three designs.', 'task'),
    ]),
    topic('Experimental & Quasi-Experimental Designs', 'RCTs and their practical alternatives.', [
      activity('Design Critique Discussion', 'Debate the strengths and limits of each design.', 'discussion'),
    ]),
  ]),
]);

const researchMethodsModuleTwo = module('Data Collection & Management', 'Sampling strategies, instruments, and data governance.', [
  lesson('Sampling Strategies', 'Probability and non-probability sampling in the field.', [
    topic('Sample Size and Power', 'Why sample size matters and how it is computed.', [
      activity('Sample Size Calculations', 'Compute sample sizes for three scenarios.', 'exercise'),
    ]),
    topic('Recruitment in Practice', 'Reaching participants responsibly.', [
      activity('Recruitment Plan Sketch', 'Draft a recruitment plan with retention measures.', 'project-step'),
    ]),
  ]),
  lesson('Questionnaire & Survey Design', 'Designing instruments that measure what they intend.', [
    topic('Question Types and Wording', 'Avoiding bias in item construction.', [
      activity('Questionnaire Review', 'Peer-review a sample questionnaire for bias.', 'discussion'),
    ]),
    topic('Piloting and Validation', 'Testing instruments before full deployment.', [
      activity('Pilot Log Exercise', 'Record pilot responses and refine items.', 'task'),
    ]),
  ]),
]);

const researchMethodsModuleThree = module('Analysis, Reporting & Integrity', 'Interpreting findings and reporting responsibly.', [
  lesson('Interpreting Quantitative Findings', 'From outputs to defensible conclusions.', [
    topic('Reading Statistical Output', 'Understanding coefficients, p-values, and intervals.', [
      activity('Output Interpretation Drill', 'Translate model output into plain language.', 'exercise'),
    ]),
    topic('Limitations and Bias', 'Honest reporting of study limits.', [
      activity('Limitations Paragraph', 'Write a limitations section for a sample study.', 'task'),
    ]),
  ]),
  lesson('Responsible Research Practice', 'Integrity, authorship, and data sharing.', [
    topic('Authorship and Contribution', 'Applying authorship criteria fairly.', [
      activity('Authorship Scenario', 'Resolve an authorship dispute scenario.', 'discussion'),
    ]),
    topic('Open Data and Reproducibility', 'Sharing data and code responsibly.', [
      activity('Data Sharing Plan', 'Draft a data sharing plan for a new project.', 'project-step'),
    ]),
  ]),
]);

export const RESEARCH_METHODS_COURSE: LearningCourse = {
  id: courseId('Research Methodology for Health Sciences'),
  slug: buildLearningSlug('Research Methodology for Health Sciences'),
  title: 'Research Methodology for Health Sciences',
  description: 'A foundational methods course covering research design, data collection, analysis, and responsible practice for health researchers.',
  status: 'published',
  courseKind: 'standard',
  category: 'Research Methods',
  level: 3,
  durationHours: 24,
  institutionId: 'INST-UI-001',
  institutionName: 'University of Ibadan',
  instructorUsername: SMITH.username,
  curriculumId: curriculumId('Research Methods Curriculum'),
  outcomes: [
    { id: 'rmo-1', statement: 'Formulate answerable research questions and select appropriate designs.' },
    { id: 'rmo-2', statement: 'Plan sampling and data collection strategies that uphold quality and ethics.' },
    { id: 'rmo-3', statement: 'Interpret quantitative findings and report them with integrity.' },
  ],
  modules: [RESEARCH_METHODS_MODULE_ONE, researchMethodsModuleTwo, researchMethodsModuleThree],
  createdAt: D_MAR,
  updatedAt: D_JUN,
};

const writingModuleOne = module('Writing Foundations', 'Building the habits and toolkit of a scholarly writer.', [
  lesson('Reading as a Writer', 'Learning prose craft from published literature.', [
    topic('Close Reading for Craft', 'Analysing structure, rhythm, and clarity.', [
      activity('Sentence Surgery', 'Rewrite dense sentences from a sample paper.', 'exercise'),
    ]),
    topic('Collecting Models', 'Building a personal style anthology.', [
      activity('Style Anthology', 'Curate three exemplary passages with notes.', 'task'),
    ]),
  ]),
  lesson('Clarity and Argument', 'Making every sentence work.', [
    topic('The One-Sentence Summary', 'Compressing an argument to its essence.', [
      activity('Abstract Compression', 'Reduce a 300-word abstract to one sentence.', 'exercise'),
    ]),
    topic('Paragraph Architecture', 'Topic sentences and logical chains.', [
      activity('Paragraph Reconstruction', 'Reorder scrambled paragraphs into a coherent flow.', 'task'),
    ]),
  ]),
]);

const writingModuleTwo = module('Structuring the Manuscript', 'From IMRaD to narrative coherence.', [
  lesson('Introduction and Literature Review', 'Framing the gap and the contribution.', [
    topic('Funnel Introductions', 'Moving from broad field to specific gap.', [
      activity('Funnel Outline', 'Outline an introduction using the funnel method.', 'task'),
    ]),
    topic('Synthesising Sources', 'Beyond annotated bibliographies to argument.', [
      activity('Synthesis Matrix', 'Build a synthesis matrix for ten sources.', 'project-step'),
    ]),
  ]),
  lesson('Results, Discussion, and Conclusion', 'Presenting and interpreting evidence.', [
    topic('Results as Narrative', 'Guiding the reader through tables and figures.', [
      activity('Results Walkthrough', 'Write a results narrative for a sample dataset.', 'task'),
    ]),
    topic('Discussion with Restraint', 'Claiming only what the evidence supports.', [
      activity('Discussion Drafting', 'Draft a discussion with explicit limitations.', 'task'),
    ]),
  ]),
]);

const writingModuleThree = module('Revision & Publication', 'From draft to submission.', [
  lesson('Peer Review as Practice', 'Giving and receiving useful feedback.', [
    topic('Structured Feedback', 'Prioritising revision comments.', [
      activity('Review Simulation', 'Review a sample manuscript using a rubric.', 'discussion'),
    ]),
  ]),
  lesson('Submission Strategy', 'Choosing venues and managing revisions.', [
    topic('Journal Selection', 'Matching manuscript to venue.', [
      activity('Venue Shortlist', 'Shortlist three journals with rationale.', 'task'),
    ]),
  ]),
]);

export const ACADEMIC_WRITING_COURSE: LearningCourse = {
  id: courseId('Academic Writing for Scholarly Publication'),
  slug: buildLearningSlug('Academic Writing for Scholarly Publication'),
  title: 'Academic Writing for Scholarly Publication',
  description: 'Develop the prose, structure, and revision skills needed to publish research in peer-reviewed journals.',
  status: 'published',
  courseKind: 'standard',
  category: 'Academic Writing',
  level: 3,
  durationHours: 18,
  institutionId: 'INST-UI-001',
  institutionName: 'University of Ibadan',
  instructorUsername: ADEBAYO.username,
  curriculumId: curriculumId('Academic Communication Curriculum'),
  outcomes: [
    { id: 'awo-1', statement: 'Write clear, well-argued scholarly prose.' },
    { id: 'awo-2', statement: 'Structure manuscripts to meet reader and reviewer expectations.' },
    { id: 'awo-3', statement: 'Manage peer review and submission processes effectively.' },
  ],
  modules: [writingModuleOne, writingModuleTwo, writingModuleThree],
  createdAt: D_MAR,
  updatedAt: D_JUN,
};

const statisticsModuleOne = module('R Fundamentals', 'Getting fluent with the R ecosystem.', [
  lesson('Getting Started with R', 'Projects, scripts, and reproducibility.', [
    topic('R Projects and Scripts', 'Organising analysis projects.', [
      activity('Project Scaffolding', 'Create a reproducible R project skeleton.', 'task'),
    ]),
    topic('Tidyverse Essentials', 'Reading and wrangling with dplyr and tidyr.', [
      activity('Data Wrangling Drill', 'Clean a messy CSV with the tidyverse.', 'exercise'),
    ]),
  ]),
  lesson('Visualising Data', 'Communicating with ggplot2.', [
    topic('Grammar of Graphics', 'Layers, aesthetics, and scales.', [
      activity('Plot Rebuild', 'Rebuild a chart step by step in ggplot2.', 'exercise'),
    ]),
    topic('Choosing the Right Plot', 'Matching chart to message.', [
      activity('Chart Critique', 'Critique three published charts.', 'discussion'),
    ]),
  ]),
]);

const statisticsModuleTwo = module('Descriptive & Inferential Statistics', 'Estimation and hypothesis testing done properly.', [
  lesson('Descriptive Statistics', 'Summarising distributions and associations.', [
    topic('Measures of Centre and Spread', 'When each statistic is appropriate.', [
      activity('Summary Selection', 'Choose and justify summary statistics for a dataset.', 'task'),
    ]),
  ]),
  lesson('Inferential Statistics', 'Confidence intervals and hypothesis tests.', [
    topic('Confidence Intervals', 'Estimation rather than significance.', [
      activity('Interval Interpretation', 'Interpret confidence intervals in applied examples.', 'exercise'),
    ]),
    topic('Common Tests', 't-tests, chi-square, and ANOVA.', [
      activity('Test Selection', 'Select the correct test for six research scenarios.', 'task'),
    ]),
  ]),
]);

const statisticsModuleThree = module('Regression & Reporting', 'Modelling and communicating results.', [
  lesson('Linear Regression', 'From simple to multiple regression.', [
    topic('Model Building', 'Predictors, interactions, and diagnostics.', [
      activity('Regression Practical', 'Fit and diagnose a multiple regression model.', 'exercise'),
    ]),
  ]),
  lesson('Reporting Reproducibly', 'Literate analysis with RMarkdown/Quarto.', [
    topic('Literate Programming', 'Code, prose, and output in one document.', [
      activity('Quarto Report', 'Compile a reproducible analysis report.', 'project-step'),
    ]),
  ]),
]);

export const APPLIED_STATISTICS_COURSE: LearningCourse = {
  id: courseId('Applied Statistics with R'),
  slug: buildLearningSlug('Applied Statistics with R'),
  title: 'Applied Statistics with R',
  description: 'Hands-on statistical analysis and reproducible reporting using R for researchers who already collect data.',
  status: 'published',
  courseKind: 'standard',
  category: 'Data Analysis',
  level: 3,
  durationHours: 30,
  institutionId: 'INST-UI-001',
  institutionName: 'University of Ibadan',
  instructorUsername: MARIA.username,
  curriculumId: curriculumId('Research Methods Curriculum'),
  outcomes: [
    { id: 'sto-1', statement: 'Wrangle and visualise research data in R.' },
    { id: 'sto-2', statement: 'Apply descriptive and inferential statistics correctly.' },
    { id: 'sto-3', statement: 'Produce reproducible analysis reports.' },
  ],
  modules: [statisticsModuleOne, statisticsModuleTwo, statisticsModuleThree],
  createdAt: D_MAR,
  updatedAt: D_JUN,
};

const grantModuleOne = module('Grant Landscape', 'Understanding funders and their criteria.', [
  lesson('Funding Sources', 'Mapping the funding ecosystem.', [
    topic('Types of Funders', 'Government, foundation, and corporate funding.', [
      activity('Funder Map', 'Map five relevant funders for a research area.', 'task'),
    ]),
    topic('Reading Call Documents', 'Extracting requirements and constraints.', [
      activity('Call Analysis', 'Annotate a call for proposals against a checklist.', 'exercise'),
    ]),
  ]),
  lesson('Review Criteria', 'What reviewers actually reward.', [
    topic('Significance and Novelty', 'Framing contribution to the field.', [
      activity('Significance Pitch', 'Write a two-minute significance pitch.', 'task'),
    ]),
  ]),
]);

const grantModuleTwo = module('Proposal Architecture', 'Building a persuasive, feasible proposal.', [
  lesson('The Proposal Narrative', 'Aims, objectives, and methodology.', [
    topic('Writing Aims and Objectives', 'Precise, measurable, and linked to the call.', [
      activity('Aims Rewrite', 'Sharpen a set of vague aims.', 'exercise'),
    ]),
    topic('Methodology Section', 'Convincing feasibility and rigour.', [
      activity('Methodology Build', 'Draft a methodology section from a study plan.', 'project-step'),
    ]),
  ]),
  lesson('Budget & Submission', 'Costing, partners, and logistics.', [
    topic('Budget Justification', 'Realistic and defensible costs.', [
      activity('Budget Drill', 'Build and justify a modest project budget.', 'exercise'),
    ]),
    topic('Grant Proposal Draft', 'Assembling the full application.', [
      activity('Grant Proposal Draft', 'Produce a complete grant proposal draft.', 'project-step', 'asm-grant-proposal'),
    ]),
  ]),
]);

export const GRANT_WRITING_COURSE: LearningCourse = {
  id: courseId('Grant Writing Fundamentals'),
  slug: buildLearningSlug('Grant Writing Fundamentals'),
  title: 'Grant Writing Fundamentals',
  description: 'A micro course on developing competitive research funding proposals, from reading calls to budgeting.',
  status: 'published',
  courseKind: 'micro',
  category: 'Research Funding',
  level: 2,
  durationHours: 8,
  institutionId: 'INST-UI-001',
  institutionName: 'University of Ibadan',
  instructorUsername: OKONKWO.username,
  curriculumId: curriculumId('Research Integrity & Impact Curriculum'),
  outcomes: [
    { id: 'gwo-1', statement: 'Identify suitable funders and read calls critically.' },
    { id: 'gwo-2', statement: 'Assemble a persuasive, feasible proposal with a defensible budget.' },
  ],
  modules: [grantModuleOne, grantModuleTwo],
  createdAt: D_MAY,
  updatedAt: D_JUN,
};

const ethicsModuleOne = module('Ethics Foundations', 'Principles, history, and governance.', [
  lesson('Principles of Research Ethics', 'Respect, beneficence, and justice.', [
    topic('Core Principles', 'Applying principles to concrete cases.', [
      activity('Principle Mapping', 'Map principles onto three real cases.', 'task'),
    ]),
    topic('History and Regulation', 'From past harms to modern guidance.', [
      activity('Timeline Reflection', 'Reflect on a landmark case and its lessons.', 'discussion'),
    ]),
  ]),
  lesson('Research Governance', 'Institutional review and compliance.', [
    topic('Ethics Committees', 'What reviewers look for.', [
      activity('Application Walkthrough', 'Trace a sample ethics application through review.', 'task'),
    ]),
    topic('Informed Consent', 'Designing consent that actually informs.', [
      activity('Consent Design', 'Draft a plain-language consent form.', 'exercise'),
    ]),
  ]),
]);

const ethicsModuleTwo = module('Ethics in Practice', 'Integrity across the research lifecycle.', [
  lesson('Data and Privacy', 'Protecting participants and data.', [
    topic('Data Minimisation', 'Collecting only what is needed.', [
      activity('Data Plan Review', 'Review a data management plan for privacy risks.', 'task'),
    ]),
  ]),
  lesson('Authorship and Misconduct', 'Fair credit and honest practice.', [
    topic('Publication Ethics', 'Authorship, plagiarism, and fabrication.', [
      activity('Ethics Case', 'Resolve a publication ethics case study.', 'discussion', 'asm-ethics-case'),
    ]),
  ]),
]);

export const RESEARCH_ETHICS_COURSE: LearningCourse = {
  id: courseId('Research Ethics Essentials'),
  slug: buildLearningSlug('Research Ethics Essentials'),
  title: 'Research Ethics Essentials',
  description: 'A micro course on conducting research with integrity, from informed consent to publication ethics.',
  status: 'published',
  courseKind: 'micro',
  category: 'Research Integrity',
  level: 2,
  durationHours: 6,
  institutionId: 'INST-UI-001',
  institutionName: 'University of Ibadan',
  instructorUsername: DUBE.username,
  curriculumId: curriculumId('Academic Communication Curriculum'),
  outcomes: [
    { id: 'eto-1', statement: 'Apply core ethical principles to research planning.' },
    { id: 'eto-2', statement: 'Design consent, privacy, and integrity safeguards in practice.' },
  ],
  modules: [ethicsModuleOne, ethicsModuleTwo],
  createdAt: D_MAR,
  updatedAt: D_JUN,
};

const dataLiteracyModuleOne = module('Data Fundamentals', 'Understanding data in the research context.', [
  lesson('Data in Research', 'Types, sources, and quality.', [
    topic('Data Types and Sources', 'Primary, secondary, and administrative data.', [
      activity('Data Source Inventory', 'List candidate data sources for a study.', 'task'),
    ]),
    topic('Data Quality', 'Accuracy, completeness, and timeliness.', [
      activity('Quality Audit', 'Assess a sample dataset for quality issues.', 'exercise'),
    ]),
  ]),
  lesson('FAIR Principles', 'Making data findable, accessible, interoperable, reusable.', [
    topic('Applying FAIR', 'Practical steps for each principle.', [
      activity('FAIR Check', 'Score a dataset against the FAIR principles.', 'task'),
    ]),
  ]),
]);

const dataLiteracyModuleTwo = module('Working with Data', 'Cleaning, documenting, and protecting data.', [
  lesson('Data Cleaning', 'From messy to analysis-ready.', [
    topic('Cleaning Workflows', 'Handling missing values and duplicates.', [
      activity('Cleaning Exercise', 'Clean a messy dataset with a documented workflow.', 'exercise'),
    ]),
  ]),
  lesson('Data Documentation', 'Metadata and provenance.', [
    topic('Data Dictionaries', 'Documenting variables and codes.', [
      activity('Dictionary Build', 'Write a data dictionary for a sample dataset.', 'task'),
    ]),
    topic('Secure Data Handling', 'Storage, sharing, and retention.', [
      activity('Handling Plan', 'Draft a secure data handling plan.', 'project-step'),
    ]),
  ]),
]);

export const DATA_LITERACY_COURSE: LearningCourse = {
  id: courseId('Data Literacy for Researchers'),
  slug: buildLearningSlug('Data Literacy for Researchers'),
  title: 'Data Literacy for Researchers',
  description: 'A micro course on reading, managing, and curating research data responsibly, aligned with the FAIR principles.',
  status: 'published',
  courseKind: 'micro',
  category: 'Data Skills',
  level: 2,
  durationHours: 10,
  institutionId: 'INST-UI-001',
  institutionName: 'University of Ibadan',
  instructorUsername: TANAKA.username,
  curriculumId: curriculumId('Data Science Foundations Curriculum'),
  outcomes: [
    { id: 'dlo-1', statement: 'Assess data quality and apply the FAIR principles.' },
    { id: 'dlo-2', statement: 'Clean, document, and protect research data.' },
  ],
  modules: [dataLiteracyModuleOne, dataLiteracyModuleTwo],
  createdAt: D_MAY,
  updatedAt: D_JUN,
};

export const LEARNING_COURSES: LearningCourse[] = [
  RESEARCH_METHODS_COURSE,
  ACADEMIC_WRITING_COURSE,
  APPLIED_STATISTICS_COURSE,
  GRANT_WRITING_COURSE,
  RESEARCH_ETHICS_COURSE,
  DATA_LITERACY_COURSE,
];

// ---------------------------------------------------------------------------
// Programmes
// ---------------------------------------------------------------------------

export const POSTGRADUATE_RESEARCH_PROGRAMME: LearningProgramme = {
  id: programmeId('Postgraduate Research Training Programme'),
  slug: buildLearningSlug('Postgraduate Research Training Programme'),
  title: 'Postgraduate Research Training Programme',
  description: 'A structured training pathway for postgraduate researchers covering methods, data skills, writing, and ethics.',
  qualification: 'Postgraduate Research Certificate',
  durationLabel: '18 months',
  institutionId: 'INST-UI-001',
  institutionName: 'University of Ibadan',
  curricula: [
    {
      id: curriculumId('Research Methods Curriculum'),
      slug: buildLearningSlug('Research Methods Curriculum'),
      title: 'Research Methods Curriculum',
      description: 'Methods and statistical foundations for empirical research.',
      position: 1,
      courses: [RESEARCH_METHODS_COURSE, APPLIED_STATISTICS_COURSE],
      createdAt: D_MAR,
      updatedAt: D_JUN,
    },
    {
      id: curriculumId('Academic Communication Curriculum'),
      slug: buildLearningSlug('Academic Communication Curriculum'),
      title: 'Academic Communication Curriculum',
      description: 'Writing and integrity skills for scholarly communication.',
      position: 2,
      courses: [ACADEMIC_WRITING_COURSE, RESEARCH_ETHICS_COURSE],
      createdAt: D_MAR,
      updatedAt: D_JUN,
    },
  ],
  createdAt: D_MAR,
  updatedAt: D_JUN,
};

export const DIGITAL_CAPACITY_PROGRAMME: LearningProgramme = {
  id: programmeId('Digital Research Capacity Programme'),
  slug: buildLearningSlug('Digital Research Capacity Programme'),
  title: 'Digital Research Capacity Programme',
  description: 'A capacity-building pathway for data-driven, reproducible research practice.',
  qualification: 'Digital Research Capability Certificate',
  durationLabel: '12 months',
  institutionId: 'INST-UI-001',
  institutionName: 'University of Ibadan',
  curricula: [
    {
      id: curriculumId('Data Science Foundations Curriculum'),
      slug: buildLearningSlug('Data Science Foundations Curriculum'),
      title: 'Data Science Foundations Curriculum',
      description: 'Data skills and statistical analysis foundations.',
      position: 1,
      courses: [APPLIED_STATISTICS_COURSE, DATA_LITERACY_COURSE],
      createdAt: D_MAR,
      updatedAt: D_JUN,
    },
    {
      id: curriculumId('Research Integrity & Impact Curriculum'),
      slug: buildLearningSlug('Research Integrity & Impact Curriculum'),
      title: 'Research Integrity & Impact Curriculum',
      description: 'Ethics, funding, and responsible research practice.',
      position: 2,
      courses: [RESEARCH_ETHICS_COURSE, GRANT_WRITING_COURSE],
      createdAt: D_MAR,
      updatedAt: D_JUN,
    },
  ],
  createdAt: D_MAR,
  updatedAt: D_JUN,
};

export const LEARNING_PROGRAMMES: LearningProgramme[] = [POSTGRADUATE_RESEARCH_PROGRAMME, DIGITAL_CAPACITY_PROGRAMME];

// ---------------------------------------------------------------------------
// Assessments
// ---------------------------------------------------------------------------

export const LEARNING_ASSESSMENTS: LearningAssessment[] = [
  {
    id: 'asm-research-design-quiz',
    title: 'Research Design Quiz',
    description: 'Multiple-choice quiz on research questions, designs, and sampling.',
    kind: 'quiz',
    learningObjectId: RESEARCH_METHODS_QUIZ_ACTIVITY.id,
    competencyKeys: ['research-design', 'research-methods'],
    timeLimitMinutes: 30,
    passMark: 70,
    createdAt: D_MAR,
    updatedAt: D_MAY,
  },
  {
    id: 'asm-lit-review-protocol',
    title: 'Literature Review Protocol Assignment',
    description: 'Write a systematic review protocol with search strategy and inclusion criteria.',
    kind: 'assignment',
    learningObjectId: RESEARCH_METHODS_COURSE.id,
    rubricId: 'rub-research-proposal',
    competencyKeys: ['literature-review'],
    timeLimitMinutes: 120,
    passMark: 60,
    createdAt: D_MAR,
    updatedAt: D_MAY,
  },
  {
    id: 'asm-regression-practical',
    title: 'Regression Analysis Practical',
    description: 'Fit, diagnose, and report a multiple regression model in R.',
    kind: 'practical',
    learningObjectId: APPLIED_STATISTICS_COURSE.id,
    rubricId: 'rub-data-analysis',
    competencyKeys: ['data-analysis'],
    timeLimitMinutes: 90,
    passMark: 70,
    createdAt: D_MAR,
    updatedAt: D_MAY,
  },
  {
    id: 'asm-grant-proposal',
    title: 'Grant Proposal Draft',
    description: 'A complete, competitive research grant proposal with a justified budget.',
    kind: 'research-exercise',
    learningObjectId: GRANT_WRITING_COURSE.id,
    rubricId: 'rub-research-proposal',
    competencyKeys: ['grant-writing'],
    timeLimitMinutes: 0,
    passMark: 65,
    lifecycleStageId: 'proposal' as ResearchLifecycleStageId,
    createdAt: D_MAY,
    updatedAt: D_JUN,
  },
  {
    id: 'asm-ethics-case',
    title: 'Research Ethics Case Study',
    description: 'Resolve a publication ethics case, applying principles and mitigation strategies.',
    kind: 'assignment',
    learningObjectId: RESEARCH_ETHICS_COURSE.id,
    rubricId: 'rub-research-ethics',
    competencyKeys: ['research-ethics'],
    timeLimitMinutes: 60,
    passMark: 70,
    createdAt: D_MAR,
    updatedAt: D_MAY,
  },
  {
    id: 'asm-writing-draft',
    title: 'Manuscript Draft Assessment',
    description: 'Submit a full manuscript draft assessed against the academic writing rubric.',
    kind: 'assignment',
    learningObjectId: ACADEMIC_WRITING_COURSE.id,
    rubricId: 'rub-academic-writing',
    competencyKeys: ['academic-writing'],
    timeLimitMinutes: 180,
    passMark: 60,
    createdAt: D_MAR,
    updatedAt: D_MAY,
  },
  {
    id: 'asm-data-dashboard',
    title: 'Data Cleaning Dashboard Practical',
    description: 'Clean a messy dataset and document the workflow in a short dashboard.',
    kind: 'practical',
    learningObjectId: DATA_LITERACY_COURSE.id,
    rubricId: 'rub-data-analysis',
    competencyKeys: ['data-literacy'],
    timeLimitMinutes: 90,
    passMark: 65,
    createdAt: D_MAY,
    updatedAt: D_JUN,
  },
];

// ---------------------------------------------------------------------------
// Reading lists and playlists
// ---------------------------------------------------------------------------

export const READING_LISTS: LearningReadingList[] = [
  {
    id: 'rlist-methods-core',
    slug: 'methods-core',
    title: 'Core Methods Reading List',
    description: 'Foundational methodological readings for health research.',
    ownerUsername: SMITH.username,
    category: 'Methods',
    pinned: true,
    favourite: true,
    items: [
      { id: 'rl-1', position: 1, title: 'Designing Clinical Research', authors: 'Hulley et al.', year: 2013, doi: '10.3233/978-1-61499-999-9' },
      { id: 'rl-2', position: 2, title: 'Research Design: Qualitative, Quantitative, and Mixed Methods', authors: 'Creswell, J.W.', year: 2018, doi: '10.4135/9781506386706' },
      { id: 'rl-3', position: 3, title: 'Statistical Methods in Health Sciences', authors: 'Adewale, O.', year: 2020 },
    ],
    createdAt: D_MAR,
    updatedAt: D_MAY,
  },
  {
    id: 'rlist-writing-craft',
    slug: 'writing-craft',
    title: 'Academic Writing Craft List',
    description: 'Readings on scholarly prose and argumentation.',
    ownerUsername: ADEBAYO.username,
    category: 'Writing',
    favourite: true,
    items: [
      { id: 'rl-4', position: 1, title: 'Style: Lessons in Clarity and Grace', authors: 'Williams, J.M.', year: 2014 },
      { id: 'rl-5', position: 2, title: 'They Say / I Say', authors: 'Graff & Birkenstein', year: 2017, doi: '10.4324/9781315111760' },
    ],
    createdAt: D_MAR,
    updatedAt: D_MAY,
  },
];

export const READING_PLAYLISTS: LearningReadingPlaylist[] = [
  {
    id: 'rplay-reproducible-research',
    slug: 'reproducible-research',
    title: 'Reproducible Research Pathway',
    description: 'A sequenced playlist from data management to reproducible reporting.',
    ownerUsername: MARIA.username,
    items: [
      { id: 'rpl-1', position: 1, title: 'Data Literacy for Researchers', ref: { nodeType: 'course', nodeId: DATA_LITERACY_COURSE.id } },
      { id: 'rpl-2', position: 2, title: 'Applied Statistics with R', ref: { nodeType: 'course', nodeId: APPLIED_STATISTICS_COURSE.id } },
    ],
    createdAt: D_MAY,
    updatedAt: D_JUN,
  },
];

// ---------------------------------------------------------------------------
// Learning paths
// ---------------------------------------------------------------------------

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: pathId('Early-Career Researcher Path'),
    slug: buildLearningSlug('Early-Career Researcher Path'),
    title: 'Early-Career Researcher Path',
    description: 'A guided route from research fundamentals to publication readiness.',
    ownerUsername: OJURI.username,
    purpose: 'Establish a rigorous research foundation and a first publication.',
    items: [
      { id: 'lpi-1', position: 1, title: 'Research Methodology for Health Sciences', ref: { nodeType: 'course', nodeId: RESEARCH_METHODS_COURSE.id } },
      { id: 'lpi-2', position: 2, title: 'Applied Statistics with R', ref: { nodeType: 'course', nodeId: APPLIED_STATISTICS_COURSE.id } },
      { id: 'lpi-3', position: 3, title: 'Academic Writing for Scholarly Publication', ref: { nodeType: 'course', nodeId: ACADEMIC_WRITING_COURSE.id } },
    ],
    isPublic: true,
    createdAt: D_MAR,
    updatedAt: D_JUN,
  },
  {
    id: pathId('Grant-Seeking Scholar Path'),
    slug: buildLearningSlug('Grant-Seeking Scholar Path'),
    title: 'Grant-Seeking Scholar Path',
    description: 'A focused route to competitive research funding.',
    ownerUsername: OJURI.username,
    purpose: 'Develop the proposal, ethics, and budgeting skills needed to win a research grant.',
    items: [
      { id: 'lpi-4', position: 1, title: 'Research Ethics Essentials', ref: { nodeType: 'course', nodeId: RESEARCH_ETHICS_COURSE.id } },
      { id: 'lpi-5', position: 2, title: 'Grant Writing Fundamentals', ref: { nodeType: 'course', nodeId: GRANT_WRITING_COURSE.id } },
    ],
    isPublic: true,
    createdAt: D_MAY,
    updatedAt: D_JUN,
  },
];

// ---------------------------------------------------------------------------
// Mentorship
// ---------------------------------------------------------------------------

export const LEARNING_MENTORS: LearningMentor[] = [
  { username: SMITH.username, name: SMITH.displayName, kind: 'supervisor', expertise: ['health research', 'research methods', 'public health'], institutionId: 'INST-UI-001', institutionName: 'University of Ibadan' },
  { username: ADEBAYO.username, name: ADEBAYO.displayName, kind: 'research-mentor', expertise: ['academic writing', 'publication', 'peer review'], institutionId: 'INST-UI-001', institutionName: 'University of Ibadan' },
  { username: MARIA.username, name: MARIA.displayName, kind: 'research-mentor', expertise: ['statistics', 'r programming', 'data analysis'], institutionId: 'INST-UI-001', institutionName: 'University of Ibadan' },
  { username: TANAKA.username, name: TANAKA.displayName, kind: 'research-mentor', expertise: ['data science', 'data literacy', 'machine learning'], institutionId: 'INST-UI-001', institutionName: 'University of Ibadan' },
  { username: OKONKWO.username, name: OKONKWO.displayName, kind: 'institutional-mentor', expertise: ['grant writing', 'funding', 'research administration'], institutionId: 'INST-UI-001', institutionName: 'University of Ibadan' },
  { username: SCHNEIDER.username, name: SCHNEIDER.displayName, kind: 'industry-mentor', expertise: ['data innovation', 'industry research', 'entrepreneurship'], institutionId: 'INST-UI-001', institutionName: 'University of Ibadan' },
];

export const LEARNING_MENTORSHIPS: LearningMentorship[] = [
  {
    id: mentorshipId(OJURI.username, SMITH.username),
    mentorUsername: SMITH.username,
    mentorName: SMITH.displayName,
    menteeUsername: OJURI.username,
    menteeName: OJURI.displayName,
    kind: 'supervisor',
    status: 'active',
    startedAt: D_MAR,
    milestones: [
      { id: 'ms-1', title: 'Agree research plan', status: 'achieved', dueDate: D_MAR },
      { id: 'ms-2', title: 'Submit thesis proposal', status: 'in-progress', dueDate: D_JUL },
      { id: 'ms-3', title: 'First manuscript draft', status: 'planned', dueDate: '2026-11-15T10:00:00.000Z' },
    ],
    createdAt: D_MAR,
    updatedAt: D_JUN,
  },
  {
    id: mentorshipId(OJURI.username, ADEBAYO.username),
    mentorUsername: ADEBAYO.username,
    mentorName: ADEBAYO.displayName,
    menteeUsername: OJURI.username,
    menteeName: OJURI.displayName,
    kind: 'research-mentor',
    status: 'active',
    startedAt: D_MAY,
    milestones: [
      { id: 'ms-4', title: 'Manuscript outline review', status: 'achieved', dueDate: D_MAY },
      { id: 'ms-5', title: 'Full draft review', status: 'planned', dueDate: '2026-09-30T10:00:00.000Z' },
    ],
    createdAt: D_MAY,
    updatedAt: D_JUN,
  },
  {
    id: mentorshipId(OJURI.username, TANAKA.username),
    mentorUsername: TANAKA.username,
    mentorName: TANAKA.displayName,
    menteeUsername: OJURI.username,
    menteeName: OJURI.displayName,
    kind: 'research-mentor',
    status: 'requested',
    milestones: [],
    createdAt: D_JUN,
    updatedAt: D_JUN,
  },
];

// ---------------------------------------------------------------------------
// Events and academies
// ---------------------------------------------------------------------------

export const LEARNING_EVENTS: LearningEvent[] = [
  {
    id: eventId('Systematic Review Workshop'),
    slug: buildLearningSlug('Systematic Review Workshop'),
    title: 'Systematic Review Workshop',
    description: 'A hands-on workshop on search strategies, appraisal, and synthesis for systematic reviews.',
    kind: 'workshop',
    mode: 'hybrid',
    hostUsername: SMITH.username,
    hostName: SMITH.displayName,
    startAt: '2026-09-10T09:00:00.000Z',
    endAt: '2026-09-11T17:00:00.000Z',
    capacity: 60,
    academyId: 'aca-research-school-methods',
    registrationCount: 42,
    createdAt: D_JUN,
  },
  {
    id: eventId('R for Reproducible Research Bootcamp'),
    slug: buildLearningSlug('R for Reproducible Research Bootcamp'),
    title: 'R for Reproducible Research Bootcamp',
    description: 'An intensive bootcamp on tidyverse, ggplot2, and reproducible analysis.',
    kind: 'bootcamp',
    mode: 'online',
    hostUsername: MARIA.username,
    hostName: MARIA.displayName,
    startAt: '2026-10-05T09:00:00.000Z',
    endAt: '2026-10-09T17:00:00.000Z',
    capacity: 80,
    academyId: 'aca-virtual-research-data',
    registrationCount: 67,
    createdAt: D_JUN,
  },
  {
    id: eventId('Academic Writing Masterclass'),
    slug: buildLearningSlug('Academic Writing Masterclass'),
    title: 'Academic Writing Masterclass',
    description: 'A masterclass on scholarly prose, structure, and navigating peer review.',
    kind: 'masterclass',
    mode: 'in-person',
    hostUsername: ADEBAYO.username,
    hostName: ADEBAYO.displayName,
    startAt: '2026-11-18T10:00:00.000Z',
    endAt: '2026-11-19T16:00:00.000Z',
    capacity: 40,
    academyId: 'aca-postgraduate-school',
    registrationCount: 31,
    createdAt: D_JUN,
  },
  {
    id: eventId('Grant Writing Seminar Series'),
    slug: buildLearningSlug('Grant Writing Seminar Series'),
    title: 'Grant Writing Seminar Series',
    description: 'A seminar series on the grant lifecycle, proposal architecture, and budgeting.',
    kind: 'seminar',
    mode: 'online',
    hostUsername: OKONKWO.username,
    hostName: OKONKWO.displayName,
    startAt: '2026-09-22T14:00:00.000Z',
    endAt: '2026-11-24T16:00:00.000Z',
    capacity: 120,
    academyId: 'aca-research-funding-academy',
    registrationCount: 88,
    createdAt: D_JUN,
  },
  {
    id: eventId('Digital Research Summer School'),
    slug: buildLearningSlug('Digital Research Summer School'),
    title: 'Digital Research Summer School',
    description: 'A summer school on data literacy, reproducible workflows, and open science.',
    kind: 'summer-school',
    mode: 'hybrid',
    hostUsername: TANAKA.username,
    hostName: TANAKA.displayName,
    startAt: '2026-12-01T09:00:00.000Z',
    endAt: '2026-12-12T17:00:00.000Z',
    capacity: 100,
    academyId: 'aca-virtual-research-data',
    registrationCount: 54,
    createdAt: D_JUN,
  },
  {
    id: eventId('Responsible Research Training Series'),
    slug: buildLearningSlug('Responsible Research Training Series'),
    title: 'Responsible Research Training Series',
    description: 'A series on research ethics, integrity, and responsible data practice.',
    kind: 'training-series',
    mode: 'online',
    hostUsername: DUBE.username,
    hostName: DUBE.displayName,
    startAt: '2026-10-13T13:00:00.000Z',
    endAt: '2026-12-08T15:00:00.000Z',
    capacity: 150,
    academyId: 'aca-research-integrity',
    registrationCount: 91,
    createdAt: D_JUN,
  },
];

export const LEARNING_ACADEMIES: LearningAcademy[] = [
  {
    id: academyId('University of Ibadan Postgraduate School'),
    slug: buildLearningSlug('University of Ibadan Postgraduate School'),
    name: 'University of Ibadan Postgraduate School',
    description: 'The central postgraduate training academy of the University of Ibadan.',
    kind: 'institution',
    institutionId: 'INST-UI-001',
    institutionName: 'University of Ibadan',
    members: [OJURI.username, SMITH.username, ADEBAYO.username, MARIA.username, TANAKA.username, OKONKWO.username, DUBE.username],
    createdAt: D_MAR,
  },
  {
    id: academyId('Faculty of Public Health Academy'),
    slug: buildLearningSlug('Faculty of Public Health Academy'),
    name: 'Faculty of Public Health Academy',
    description: 'Faculty-level training for public health researchers.',
    kind: 'faculty',
    institutionId: 'INST-UI-001',
    institutionName: 'University of Ibadan',
    members: [OJURI.username, SMITH.username],
    createdAt: D_MAR,
  },
  {
    id: academyId('Doctoral School of Health Sciences'),
    slug: buildLearningSlug('Doctoral School of Health Sciences'),
    name: 'Doctoral School of Health Sciences',
    description: 'A doctoral training school for health sciences candidates.',
    kind: 'doctoral',
    institutionId: 'INST-UI-001',
    institutionName: 'University of Ibadan',
    members: [OJURI.username, SMITH.username, DUBE.username],
    createdAt: D_MAR,
  },
  {
    id: academyId('Research School of Methods and Statistics'),
    slug: buildLearningSlug('Research School of Methods and Statistics'),
    name: 'Research School of Methods & Statistics',
    description: 'Methods and statistics training for empirical researchers.',
    kind: 'research',
    institutionId: 'INST-UI-001',
    institutionName: 'University of Ibadan',
    members: [MARIA.username, SMITH.username, OJURI.username],
    createdAt: D_MAR,
  },
  {
    id: academyId('Virtual Research Data School'),
    slug: buildLearningSlug('Virtual Research Data School'),
    name: 'Virtual Research Data School',
    description: 'An open, virtual school for data literacy and reproducible research.',
    kind: 'virtual-research',
    members: [TANAKA.username, MARIA.username, OJURI.username],
    createdAt: D_MAY,
  },
];

// ---------------------------------------------------------------------------
// Institutions
// ---------------------------------------------------------------------------

export const LEARNING_INSTITUTIONS: LearningInstitution[] = [
  { id: 'INST-UI-001', name: 'University of Ibadan', shortName: 'UI', country: 'Nigeria', kind: 'university' },
  { id: 'INST-LAG-005', name: 'University of Lagos', shortName: 'UNILAG', country: 'Nigeria', kind: 'university' },
  { id: 'INST-UG-004', name: 'University of Ghana', shortName: 'UG', country: 'Ghana', kind: 'university' },
  { id: 'INST-KNUST-007', name: 'Kwame Nkrumah University of Science and Technology', shortName: 'KNUST', country: 'Ghana', kind: 'university' },
  { id: 'INST-UNN-003', name: 'University of Nigeria', shortName: 'UNN', country: 'Nigeria', kind: 'university' },
  { id: 'INST-ARIHI-008', name: 'African Research Institute for Health Innovation', shortName: 'ARIHI', country: 'Nigeria', kind: 'research-institute' },
];

// ---------------------------------------------------------------------------
// Credentials
// ---------------------------------------------------------------------------

export const LEARNING_CERTIFICATES: LearningCertificate[] = [
  {
    id: 'cert-ethics-ojuri',
    kind: 'certificate',
    title: 'Research Ethics Essentials — Certificate of Completion',
    issuerUsername: DUBE.username,
    issuerName: DUBE.displayName,
    learnerUsername: OJURI.username,
    learnerName: OJURI.displayName,
    issuedAt: D_JUL,
    verificationReference: verificationReferenceFor('certificate', 'cert-ethics-ojuri'),
    status: 'issued',
    courseId: RESEARCH_ETHICS_COURSE.id,
    completedAt: D_JUL,
  },
  {
    id: 'cert-data-literacy-ojuri',
    kind: 'certificate',
    title: 'Data Literacy for Researchers — Certificate of Completion',
    issuerUsername: TANAKA.username,
    issuerName: TANAKA.displayName,
    learnerUsername: OJURI.username,
    learnerName: OJURI.displayName,
    issuedAt: D_JUL,
    verificationReference: verificationReferenceFor('certificate', 'cert-data-literacy-ojuri'),
    status: 'issued',
    courseId: DATA_LITERACY_COURSE.id,
    completedAt: D_JUL,
  },
];

export const LEARNING_BADGES: LearningBadge[] = [
  {
    id: badgeId('Research Ethics Champion'),
    kind: 'badge',
    title: 'Research Ethics Champion',
    issuerUsername: DUBE.username,
    issuerName: DUBE.displayName,
    learnerUsername: OJURI.username,
    learnerName: OJURI.displayName,
    issuedAt: D_JUL,
    verificationReference: verificationReferenceFor('badge', badgeId('Research Ethics Champion')),
    status: 'issued',
    competencyKey: 'research-ethics',
    imageUrl: '/badges/research-ethics-champion.svg',
    standard: 'SLE Competency Framework v1',
  },
  {
    id: badgeId('Data Explorer'),
    kind: 'badge',
    title: 'Data Explorer',
    issuerUsername: TANAKA.username,
    issuerName: TANAKA.displayName,
    learnerUsername: OJURI.username,
    learnerName: OJURI.displayName,
    issuedAt: D_JUL,
    verificationReference: verificationReferenceFor('badge', badgeId('Data Explorer')),
    status: 'issued',
    competencyKey: 'data-literacy',
    imageUrl: '/badges/data-explorer.svg',
    standard: 'SLE Competency Framework v1',
  },
  {
    id: badgeId('Early-Career Writer'),
    kind: 'badge',
    title: 'Early-Career Writer',
    issuerUsername: ADEBAYO.username,
    issuerName: ADEBAYO.displayName,
    learnerUsername: OJURI.username,
    learnerName: OJURI.displayName,
    issuedAt: D_MAY,
    verificationReference: verificationReferenceFor('badge', badgeId('Early-Career Writer')),
    status: 'issued',
    competencyKey: 'academic-writing',
    imageUrl: '/badges/early-career-writer.svg',
    standard: 'SLE Competency Framework v1',
  },
];

export const LEARNING_CPD_RECORDS: LearningCpdRecord[] = [
  {
    id: cpdRecordId('Methods Journal Club'),
    kind: 'cpd',
    title: 'Methods Journal Club — 6 hours CPD',
    issuerUsername: OJURI.username,
    issuerName: OJURI.displayName,
    learnerUsername: OJURI.username,
    learnerName: OJURI.displayName,
    issuedAt: D_MAY,
    verificationReference: verificationReferenceFor('cpd', cpdRecordId('Methods Journal Club')),
    status: 'issued',
    hours: 6,
    activityTitle: 'Methods Journal Club',
    activityDate: D_MAY,
  },
  {
    id: cpdRecordId('Grant Proposal Clinic'),
    kind: 'cpd',
    title: 'Grant Proposal Clinic — 4 hours CPD',
    issuerUsername: OJURI.username,
    issuerName: OJURI.displayName,
    learnerUsername: OJURI.username,
    learnerName: OJURI.displayName,
    issuedAt: D_JUN,
    verificationReference: verificationReferenceFor('cpd', cpdRecordId('Grant Proposal Clinic')),
    status: 'issued',
    hours: 4,
    activityTitle: 'Grant Proposal Clinic',
    activityDate: D_JUN,
  },
];

export const LEARNING_PASSPORT = {
  id: 'passport-ojuri',
  learnerUsername: OJURI.username,
  certificates: LEARNING_CERTIFICATES,
  badges: LEARNING_BADGES,
  cpdRecords: LEARNING_CPD_RECORDS,
  updatedAt: D_JUL,
};

// ---------------------------------------------------------------------------
// Portfolios
// ---------------------------------------------------------------------------

function portfolio(learner: string, kind: LearningPortfolio['kind'], title: string, description: string, items: PortfolioItem[]): LearningPortfolio {
  return {
    id: portfolioId(learner, kind),
    learnerUsername: learner,
    kind,
    title,
    description,
    items,
    createdAt: D_MAR,
    updatedAt: D_JUL,
  };
}

export const LEARNING_PORTFOLIOS: LearningPortfolio[] = [
  portfolio(OJURI.username, 'research', 'Research Portfolio', 'Ongoing research projects and outputs.', [
    { id: 'pfi-1', title: 'Health-seeking behaviour among urban adolescents', kind: 'research', date: '2026-06-01', evidenceRef: 'project:htsf-001', evidenceType: 'project', visibility: 'public' },
    { id: 'pfi-2', title: 'Systematic review of maternal health interventions', kind: 'research', date: '2026-07-15', evidenceRef: 'manuscript:sr-012', evidenceType: 'manuscript', visibility: 'shared' },
  ]),
  portfolio(OJURI.username, 'teaching', 'Teaching Portfolio', 'Teaching and mentoring activities.', [
    { id: 'pfi-3', title: 'Teaching assistant, Research Methods', kind: 'teaching', date: '2026-05-01', evidenceRef: 'course:rm-101', evidenceType: 'course', visibility: 'shared' },
  ]),
  portfolio(OJURI.username, 'professional', 'Professional Portfolio', 'Professional memberships and services.', [
    { id: 'pfi-4', title: 'Reviewer, African Journal of Health Sciences', kind: 'professional', date: '2026-04-10', evidenceRef: 'reviewer:ajhs', evidenceType: 'membership', visibility: 'public' },
  ]),
  portfolio(OJURI.username, 'awards', 'Awards Portfolio', 'Awards and recognitions.', [
    { id: 'pfi-5', title: 'Best Paper Award, Health Research Students Conference', kind: 'awards', date: '2026-03-05', evidenceRef: 'award:hrsc-2026', evidenceType: 'award', visibility: 'public' },
  ]),
  portfolio(OJURI.username, 'certification', 'Certification Portfolio', 'Credentials and professional development.', [
    { id: 'pfi-6', title: 'Research Ethics Essentials certificate', kind: 'certification', date: D_JUL, evidenceRef: 'cert-ethics-ojuri', evidenceType: 'certificate', visibility: 'public' },
    { id: 'pfi-7', title: 'Data Literacy for Researchers certificate', kind: 'certification', date: D_JUL, evidenceRef: 'cert-data-literacy-ojuri', evidenceType: 'certificate', visibility: 'public' },
  ]),
  portfolio(OJURI.username, 'competency', 'Competency Portfolio', 'Evidence of competency development.', [
    { id: 'pfi-8', title: 'Research Design self-check passed (80%)', kind: 'competency', date: D_JUN, evidenceRef: 'asm-research-design-quiz', evidenceType: 'assessment', visibility: 'shared' },
    { id: 'pfi-9', title: 'Grant Proposal draft submitted (72%)', kind: 'competency', date: D_JUN, evidenceRef: 'asm-grant-proposal', evidenceType: 'assessment', visibility: 'private' },
  ]),
  portfolio(OJURI.username, 'community', 'Community Portfolio', 'Community engagement activities.', [
    { id: 'pfi-10', title: 'Mentor, Women in Health Research Network', kind: 'community', date: '2026-02-20', evidenceRef: 'community:whrn', evidenceType: 'membership', visibility: 'public' },
  ]),
  portfolio(OJURI.username, 'leadership', 'Leadership Portfolio', 'Leadership roles and service.', [
    { id: 'pfi-11', title: 'Postgraduate Students Research Forum lead', kind: 'leadership', date: '2026-01-15', evidenceRef: 'role:pgforum-lead', evidenceType: 'role', visibility: 'shared' },
  ]),
];

// ---------------------------------------------------------------------------
// Goals and history
// ---------------------------------------------------------------------------

export const LEARNING_GOALS: LearningGoal[] = [
  {
    id: goalId('Complete a publishable systematic review'),
    learnerUsername: OJURI.username,
    statement: 'Complete a publishable systematic review manuscript on maternal health interventions.',
    targetCompetencyKeys: ['literature-review', 'academic-writing'],
    status: 'active',
    createdAt: D_MAR,
  },
  {
    id: goalId('Master reproducible data analysis'),
    learnerUsername: OJURI.username,
    statement: 'Master reproducible data analysis with R for my research datasets.',
    targetCompetencyKeys: ['data-analysis', 'data-literacy'],
    status: 'active',
    createdAt: D_MAR,
  },
  {
    id: goalId('Secure a competitive research grant'),
    learnerUsername: OJURI.username,
    statement: 'Secure a competitive research grant by the end of the year.',
    targetCompetencyKeys: ['grant-writing', 'research-ethics'],
    status: 'active',
    createdAt: D_MAY,
  },
];

export const LEARNING_HISTORY = [
  { id: historyEntryId('enrolled-research-methods'), learnerUsername: OJURI.username, eventType: 'enrolled', objectRef: { nodeType: 'course', nodeId: RESEARCH_METHODS_COURSE.id }, detail: 'Enrolled in Research Methodology for Health Sciences', occurredAt: D_MAR },
  { id: historyEntryId('path-started-early-career'), learnerUsername: OJURI.username, eventType: 'path-started', objectRef: { nodeType: 'path', nodeId: LEARNING_PATHS[0].id }, detail: 'Started the Early-Career Researcher Path', occurredAt: D_MAR },
  { id: historyEntryId('enrolled-ethics'), learnerUsername: OJURI.username, eventType: 'enrolled', objectRef: { nodeType: 'course', nodeId: RESEARCH_ETHICS_COURSE.id }, detail: 'Enrolled in Research Ethics Essentials', occurredAt: D_MAR },
  { id: historyEntryId('assessment-passed-ethics'), learnerUsername: OJURI.username, eventType: 'assessment-passed', objectRef: { nodeType: 'activity', nodeId: 'act-ethics-case' }, detail: 'Passed Research Ethics Case Study (88%)', occurredAt: D_JUN },
  { id: historyEntryId('course-completed-ethics'), learnerUsername: OJURI.username, eventType: 'course-completed', objectRef: { nodeType: 'course', nodeId: RESEARCH_ETHICS_COURSE.id }, detail: 'Completed Research Ethics Essentials', occurredAt: D_JUL },
  { id: historyEntryId('certificate-issued-ethics'), learnerUsername: OJURI.username, eventType: 'certificate-issued', objectRef: { nodeType: 'assessment', nodeId: 'cert-ethics-ojuri' }, detail: 'Certificate issued — Research Ethics Essentials', occurredAt: D_JUL },
  { id: historyEntryId('enrolled-data-literacy'), learnerUsername: OJURI.username, eventType: 'enrolled', objectRef: { nodeType: 'course', nodeId: DATA_LITERACY_COURSE.id }, detail: 'Enrolled in Data Literacy for Researchers', occurredAt: D_MAY },
  { id: historyEntryId('course-completed-data-literacy'), learnerUsername: OJURI.username, eventType: 'course-completed', objectRef: { nodeType: 'course', nodeId: DATA_LITERACY_COURSE.id }, detail: 'Completed Data Literacy for Researchers', occurredAt: D_JUL },
  { id: historyEntryId('badge-earned-data-explorer'), learnerUsername: OJURI.username, eventType: 'badge-earned', objectRef: { nodeType: 'assessment', nodeId: badgeId('Data Explorer') }, detail: 'Earned the Data Explorer badge', occurredAt: D_JUL },
  { id: historyEntryId('mentorship-started-supervisor'), learnerUsername: OJURI.username, eventType: 'mentorship-started', objectRef: { nodeType: 'course', nodeId: 'mtr-ojuri-smith' }, detail: 'Started supervision with Professor Smith', occurredAt: D_MAR },
  { id: historyEntryId('cpd-recorded-journal-club'), learnerUsername: OJURI.username, eventType: 'cpd-recorded', detail: 'Recorded 6 hours CPD — Methods Journal Club', occurredAt: D_MAY },
  { id: historyEntryId('assessment-passed-grant'), learnerUsername: OJURI.username, eventType: 'assessment-passed', objectRef: { nodeType: 'activity', nodeId: 'act-grant-proposal-draft' }, detail: 'Submitted Grant Proposal Draft (72%)', occurredAt: D_JUN },
] as LearningHistoryEntry[];

// ---------------------------------------------------------------------------
// Progress
// ---------------------------------------------------------------------------

type AnyNode = LearningCourse | LearningModule | LearningLesson | LearningTopic | LearningActivity;

function nodeTypeOf(node: AnyNode): LearningProgressEntry['nodeType'] {
  if ('modules' in node) return 'course';
  if ('lessons' in node) return 'module';
  if ('topics' in node) return 'lesson';
  if ('activities' in node) return 'topic';
  return 'activity';
}

function childrenOf(node: AnyNode): AnyNode[] {
  if ('modules' in node) return node.modules;
  if ('lessons' in node) return node.lessons;
  if ('topics' in node) return node.topics;
  if ('activities' in node) return node.activities;
  return [];
}

function subtreeCompletion(node: AnyNode, completedAt: string, scores: Record<string, number> = {}): LearningProgressEntry[] {
  return [
    { nodeType: nodeTypeOf(node), learningObjectId: node.id, state: 'completed', completedAt, score: scores[node.id] },
    ...childrenOf(node).flatMap((child) => subtreeCompletion(child, completedAt, scores)),
  ];
}

function progressEntry(nodeType: LearningProgressEntry['nodeType'], learningObjectId: string, state: LearningProgressEntry['state'], completedAt?: string, score?: number): LearningProgressEntry {
  return { nodeType, learningObjectId, state, completedAt, score };
}

const LEARNING_PROGRESS_RAW: LearningProgressEntry[] = [
  progressEntry('course', RESEARCH_METHODS_COURSE.id, 'in-progress'),
  ...subtreeCompletion(RESEARCH_METHODS_MODULE_ONE, D_JUN, { [RESEARCH_METHODS_QUIZ_ACTIVITY.id]: 80 }),
  progressEntry('module', 'mod-data-collection-and-management', 'in-progress'),
  progressEntry('lesson', 'les-sampling-strategies', 'in-progress'),
  progressEntry('topic', 'top-sample-size-and-power', 'completed', D_JUN),
  progressEntry('assessment', 'asm-lit-review-protocol', 'in-progress', undefined, 55),

  progressEntry('course', ACADEMIC_WRITING_COURSE.id, 'in-progress'),
  progressEntry('lesson', 'les-clarity-and-argument', 'in-progress'),
  progressEntry('topic', 'top-the-one-sentence-summary', 'completed', D_JUN),

  progressEntry('course', GRANT_WRITING_COURSE.id, 'in-progress'),
  ...subtreeCompletion(GRANT_WRITING_COURSE.modules[0], D_JUN),
  ...subtreeCompletion(GRANT_WRITING_COURSE.modules[1], D_JUN, { [GRANT_WRITING_COURSE.id]: 72 }),

  ...subtreeCompletion(RESEARCH_ETHICS_COURSE, D_JUL, { [RESEARCH_ETHICS_COURSE.id]: 88 }),
  ...subtreeCompletion(DATA_LITERACY_COURSE, D_JUL, { [DATA_LITERACY_COURSE.id]: 78 }),
];

export const LEARNING_PROGRESS = LEARNING_PROGRESS_RAW.reduce<LearningProgressEntry[]>((acc, entry) => advanceProgress(acc, entry), []);

// ---------------------------------------------------------------------------
// Derived analytics
// ---------------------------------------------------------------------------

export const LEARNING_STATISTICS: LearningStatistics = learningStatistics({
  courses: LEARNING_COURSES,
  programmes: LEARNING_PROGRAMMES,
  paths: LEARNING_PATHS,
  assessments: LEARNING_ASSESSMENTS,
  rubrics: LEARNING_RUBRICS,
  readingLists: READING_LISTS,
  readingPlaylists: READING_PLAYLISTS,
  framework: SLE_COMPETENCY_FRAMEWORK,
  certificates: LEARNING_CERTIFICATES,
  badges: LEARNING_BADGES,
  cpdRecords: LEARNING_CPD_RECORDS,
  mentors: LEARNING_MENTORS,
  mentorships: LEARNING_MENTORSHIPS,
  academies: LEARNING_ACADEMIES,
  events: LEARNING_EVENTS,
  goals: LEARNING_GOALS,
  learners: [OJURI.username, SMITH.username, ADEBAYO.username, MARIA.username, TANAKA.username, OKONKWO.username, DUBE.username],
  institutions: LEARNING_INSTITUTIONS,
  portfolios: LEARNING_PORTFOLIOS,
});

export const LEARNING_KPIS: LearningKpis = learningKpis(LEARNING_PROGRESS, LEARNING_COURSES, LEARNING_ASSESSMENTS, SLE_COMPETENCY_FRAMEWORK);

export const LEARNING_ANALYTICS: LearningAnalytics = buildLearningAnalytics('learner', OJURI.username, LEARNING_KPIS, NOW_ISO, OJURI.username);

export const LEARNING_COMPETENCY_EVIDENCE: Record<string, number> = evidenceToLevels(LEARNING_PROGRESS, LEARNING_ASSESSMENTS);

export const LEARNING_COMPETENCY_GAPS = competencyGapAnalysis(SLE_COMPETENCY_FRAMEWORK, LEARNING_COMPETENCY_EVIDENCE);

export const LEARNING_COMPETENCY_ATTAINMENT: number = competencyAttainment(SLE_COMPETENCY_FRAMEWORK, LEARNING_COMPETENCY_EVIDENCE);

export const LEARNING_RECOMMENDATIONS: LearningAdaptiveRecommendation[] = recommendLearning(LEARNING_COURSES, LEARNING_PROGRESS, { top: 4, learnerUsername: OJURI.username });

export const LEARNING_GAP_RECOMMENDATIONS: LearningAdaptiveRecommendation[] = gapRecommendations(LEARNING_GOALS, SLE_COMPETENCY_FRAMEWORK, LEARNING_COMPETENCY_EVIDENCE, { learnerUsername: OJURI.username, top: 5 });

export const LEARNING_RECOMMENDED_MENTORS: LearningMentor[] = recommendMentors(LEARNING_MENTORS, LEARNING_GOALS, { top: 4 });

export const LEARNING_PROGRESS_BY_COURSE = LEARNING_COURSES.map((course) => ({ course, progress: courseProgress(LEARNING_PROGRESS, course) }));

export const LEARNING_CATEGORIES = Array.from(new Set(LEARNING_COURSES.map((course) => course.category))).sort();

export const FEATURED_COURSES = LEARNING_COURSES.slice(0, 3);

export const CURRENT_LEARNING_USER = CURRENT_USER;
export const CURRENT_LEARNING_USER_NAME = OJURI.displayName;
export const DEFAULT_COURSE = RESEARCH_METHODS_COURSE;
export const DEFAULT_PROGRAMME = POSTGRADUATE_RESEARCH_PROGRAMME;

// ---------------------------------------------------------------------------
// Personal workspace (Wave 3 Stage B)
// ---------------------------------------------------------------------------

export const LEARNING_READINGS: LearningReading[] = [
  { id: 'rd-1', title: 'Designing Clinical Research', authors: 'Hulley et al.', kind: 'research', progress: 62, estimatedMinutes: 180, openedAt: '2026-08-01T09:00:00.000Z', publicationType: 'Book' },
  { id: 'rd-2', title: 'Systematic Reviews in the Health Sciences', authors: 'Higgins & Green', kind: 'research', progress: 18, estimatedMinutes: 240, openedAt: '2026-07-28T14:00:00.000Z', publicationType: 'Chapter' },
  { id: 'rd-3', title: 'Research Methodology — Module 1 readings', kind: 'course', progress: 100, estimatedMinutes: 90, openedAt: '2026-07-20T10:00:00.000Z', publicationType: 'Course reading', ref: { nodeType: 'module', nodeId: RESEARCH_METHODS_MODULE_ONE.id } },
  { id: 'rd-4', title: 'Applied Statistics with R — Chapter 3', kind: 'course', progress: 35, estimatedMinutes: 120, openedAt: '2026-07-30T16:00:00.000Z', publicationType: 'Course reading' },
  { id: 'rd-5', title: 'Open Science: A Practical Guide', authors: 'Kraker et al.', kind: 'saved', progress: 0, estimatedMinutes: 150, openedAt: '2026-06-15T11:00:00.000Z', publicationType: 'Article' },
  { id: 'rd-6', title: 'Grant Writing Handbook', authors: 'Devonport, L.', kind: 'saved', progress: 45, estimatedMinutes: 110, openedAt: '2026-07-12T08:30:00.000Z', publicationType: 'Handbook' },
];

export const LEARNING_NOTES: LearningNote[] = [
  {
    id: 'nt-1',
    title: 'PICO framework reminder',
    content: 'PICO: Population, Intervention, Comparison, Outcome. Keep the population narrow enough to stay answerable within the study window.',
    richText: false,
    pinned: true,
    reference: { nodeType: 'lesson', nodeId: lessonId('From Research Question to Hypothesis'), label: 'From Research Question to Hypothesis' },
    createdAt: D_JUN,
    updatedAt: D_JUL,
  },
  {
    id: 'nt-2',
    title: 'Power and sample size',
    content: 'Sample size trades off with effect size and power. Always pre-specify before data collection.',
    richText: false,
    pinned: true,
    reference: { nodeType: 'topic', nodeId: topicId('Sample Size and Power'), label: 'Sample Size and Power' },
    createdAt: D_JUN,
    updatedAt: D_JUN,
  },
  {
    id: 'nt-3',
    title: 'Search strategy draft',
    content: 'Databases: PubMed, Scopus, Cochrane. Combine MeSH terms with Boolean operators. Log every search.',
    richText: false,
    pinned: false,
    reference: { nodeType: 'lesson', nodeId: lessonId('Systematic Search Strategies'), label: 'Systematic Search Strategies' },
    createdAt: D_MAY,
    updatedAt: D_JUN,
  },
  {
    id: 'nt-4',
    title: 'Writing block: introductions',
    content: 'Open with the gap, state the question, preview the structure. Draft freely, edit later.',
    richText: false,
    pinned: false,
    createdAt: D_JUN,
    updatedAt: D_JUL,
  },
  {
    id: 'nt-5',
    title: 'Grant budget notes',
    content: 'Justify every line. Include 10% contingency. Align costs with the workplan.',
    richText: false,
    pinned: false,
    createdAt: D_MAY,
    updatedAt: D_MAY,
  },
];

export const LEARNING_HIGHLIGHTS: LearningHighlight[] = [
  { id: 'hl-1', text: 'Randomisation reduces selection bias only when allocation is concealed from investigators.', sourceTitle: 'Designing Clinical Research', category: 'methodology', colour: '#f59e0b', createdAt: D_JUN },
  { id: 'hl-2', text: 'A research question is answerable when it can be operationalised into measurable outcomes.', sourceTitle: 'Research Design: Qualitative, Quantitative, and Mixed Methods', category: 'definition', colour: '#6366f1', createdAt: D_JUN },
  { id: 'hl-3', text: 'Reporting guidelines improve completeness and reproducibility of methods.', sourceTitle: 'Systematic Reviews in the Health Sciences', category: 'insight', colour: '#10b981', createdAt: D_JUL },
  { id: 'hl-4', text: 'Pilot data can justify a modest but realistic power calculation.', sourceTitle: 'Statistical Methods in Health Sciences', category: 'finding', colour: '#0ea5e9', createdAt: D_JUL },
  { id: 'hl-5', text: 'Cite primary sources for claims; cite the review only to point readers onward.', sourceTitle: 'Style: Lessons in Clarity and Grace', category: 'citation', colour: '#ec4899', createdAt: D_JUN },
  { id: 'hl-6', text: 'Follow up on cluster-randomised designs for the intervention arm.', sourceTitle: 'Designing Clinical Research', category: 'follow-up', colour: '#8b5cf6', createdAt: D_JUL },
];

export const LEARNING_BOOKMARKS: LearningBookmark[] = [
  { id: 'bm-1', title: 'Research Methodology for Health Sciences', kind: 'course', ref: { nodeType: 'course', nodeId: RESEARCH_METHODS_COURSE.id }, pinned: true, createdAt: D_MAR },
  { id: 'bm-2', title: 'From Research Question to Hypothesis', kind: 'lesson', ref: { nodeType: 'lesson', nodeId: lessonId('From Research Question to Hypothesis') }, pinned: true, createdAt: D_MAR },
  { id: 'bm-3', title: 'Sample Size and Power', kind: 'topic', ref: { nodeType: 'topic', nodeId: topicId('Sample Size and Power') }, pinned: false, createdAt: D_JUN },
  { id: 'bm-4', title: 'Designing Clinical Research', kind: 'reading', pinned: true, createdAt: D_JUN },
  { id: 'bm-5', title: 'Systematic review protocol template', kind: 'research', pinned: false, createdAt: D_MAY },
  { id: 'bm-6', title: 'R reproducibility webinar recording', kind: 'video', pinned: false, createdAt: D_MAY },
  { id: 'bm-7', title: 'MeSH term generator', kind: 'resource', pinned: false, createdAt: D_JUN },
];

export const LEARNING_JOURNAL: LearningJournalEntry[] = [
  { id: 'jr-1', date: '2026-07-25', kind: 'daily', title: 'Drafting the introduction', content: 'Moved the gap statement to the opening paragraph and tightened the research question. Aiming for 1,200 words by Friday.', tags: ['writing', 'systematic-review'] },
  { id: 'jr-2', date: '2026-07-18', kind: 'log', title: 'Completed ethics course', content: 'Finished Research Ethics Essentials and passed the case study at 88%.', tags: ['ethics', 'credential'] },
  { id: 'jr-3', date: '2026-07-11', kind: 'reflection', title: 'What makes a search comprehensive?', content: 'Reflecting on how iteration between pilot searches and controlled vocabularies sharpens a review protocol.', tags: ['methods'] },
  { id: 'jr-4', date: '2026-07-04', kind: 'research', title: 'Data analysis notes', content: 'Worked through regression diagnostics in R. Watch for heteroscedasticity in small samples.', tags: ['statistics', 'r'] },
  { id: 'jr-5', date: '2026-07-01', kind: 'weekly', title: 'Weekly summary — w/c 29 June', content: 'Finished module one of Research Methodology; started the R bootcamp; shortlisted two target journals.', tags: ['weekly'] },
  { id: 'jr-6', date: '2026-07-01', kind: 'diary', title: 'Progress diary — July', content: 'Credentialed in ethics and data literacy. Next milestone: systematic review protocol sign-off.', tags: ['diary'] },
  { id: 'jr-7', date: '2026-07-01', kind: 'monthly', title: 'Monthly summary — June', content: 'Completed two courses, recorded 6 hours CPD, and passed the grant proposal draft.', tags: ['monthly'] },
];

export const LEARNING_ANNOUNCEMENTS: LearningAnnouncement[] = [
  { id: 'an-1', title: 'Methods Journal Club — August', body: 'Join us 12 August to discuss cluster-randomised trials. Readings shared in the reading list.', author: 'Dr. Adebayo', publishedAt: D_JUL },
  { id: 'an-2', title: 'Research Data Week', body: 'Workshops on FAIR data and reproducible workflows run all week from 1 September.', author: 'The Library', publishedAt: D_JUL },
  { id: 'an-3', title: 'Grant clinic booking open', body: 'Book a 30-minute review slot with the research office for your proposal draft.', author: 'Research Office', publishedAt: D_JUN },
];

export const LEARNING_DEADLINES: LearningDeadline[] = [
  { id: 'dl-1', title: 'Systematic review protocol (final)', dueAt: '2026-08-15T16:00:00.000Z', kind: 'assessment', ref: { nodeType: 'assessment', nodeId: 'asm-lit-review-protocol' } },
  { id: 'dl-2', title: 'Grant proposal draft', dueAt: '2026-08-28T16:00:00.000Z', kind: 'submission' },
  { id: 'dl-3', title: 'Systematic Review Workshop', dueAt: '2026-09-10T09:00:00.000Z', kind: 'event' },
  { id: 'dl-4', title: 'Secure a competitive research grant', dueAt: '2026-12-31T23:59:00.000Z', kind: 'goal' },
];

export const LEARNING_COMPETENCY_HISTORY: LearningCompetencyHistoryEntry[] = [
  { competencyKey: 'research-design', level: 1, at: D_MAR },
  { competencyKey: 'research-design', level: 3, at: D_JUN },
  { competencyKey: 'literature-review', level: 2, at: D_MAR },
  { competencyKey: 'literature-review', level: 3, at: D_JUN },
  { competencyKey: 'data-analysis', level: 1, at: D_MAR },
  { competencyKey: 'data-analysis', level: 2, at: D_JUN },
  { competencyKey: 'data-literacy', level: 2, at: D_MAR },
  { competencyKey: 'data-literacy', level: 3, at: D_JUL },
  { competencyKey: 'academic-writing', level: 1, at: D_MAR },
  { competencyKey: 'academic-writing', level: 2, at: D_JUN },
  { competencyKey: 'research-ethics', level: 2, at: D_MAR },
  { competencyKey: 'research-ethics', level: 3, at: D_JUL },
  { competencyKey: 'grant-writing', level: 1, at: D_MAY },
  { competencyKey: 'grant-writing', level: 2, at: D_JUN },
];
