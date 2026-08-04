# Scholatia Scholarly Learning Ecosystem — Functional Specification

**Document:** `docs/LEARNING_ECOSYSTEM_FUNCTIONAL_SPECIFICATION.md`
**Mission:** Mission 003-B — Scholarly Learning Ecosystem Functional Specification
**Reference:** `docs/LEARNING_ECOSYSTEM_ARCHITECTURE.md` (Mission 003-A, approved constitutional architecture)
**Status:** Engineering specification — guides Phase 2.2G.3 implementation.
**Scope:** Specification only. No implementation, no code, no routes, no
components, no commits, no governance updates.

This specification translates the approved SLEA (Mission 003-A) into a
complete, production-grade engineering blueprint. Every requirement herein is
traceable to a chapter of `docs/LEARNING_ECOSYSTEM_ARCHITECTURE.md`.

---

# Chapter 1 — System Overview

## 1.1 Purpose

The Scholarly Learning Ecosystem (SLE) is the learning layer of Scholatia: an
open, competency-driven, AI-augmented learning platform that develops research
capacity, professional competence, and lifelong learning. It provides the
structured surface where scholars learn, are assessed fairly, are certified
credibly, and carry a portable lifelong learning record (SLEA §1.3, §2.1).

## 1.2 Objectives

1. Deliver the full Learning Object Hierarchy as a navigable, enrolable
   surface (SLEA Chapter 4).
2. Assess learning against transparent rubrics and an explicit competency
   framework with L1–L5 progression (SLEA Chapters 7, 8).
3. Issue verifiable credentials — certificates, micro credentials, digital
   badges, transcripts, CPD records, and the Learning Passport (SLEA Chapter 9).
4. Support mentorship with eight mentor roles and a governed lifecycle
   (SLEA Chapter 10).
5. Provide derived learning analytics from learner to global scale, privacy
   and consent governed (SLEA Chapter 17).
6. Provide adaptive, personalised learning (SLEA Chapter 18) and a lifelong
   academic portfolio (SLEA Chapter 19).
7. Integrate with CRIE, the Knowledge Graph, research intelligence, and every
   platform module by reference, never duplication (SLEA Chapters 13, 14).
8. Support institutional deployment with multi-tenancy readiness (SLEA
   Chapter 21) and global interoperability through an adapter layer
   (SLEA Chapter 22).

## 1.3 Actors

| Actor | Definition |
|---|---|
| **Learner** | Any researcher engaging with learning objects (Student, Researcher, or any role in learning mode). |
| **Mentor / Supervisor / Coach** | Guides learners, assesses progress, and issues mentor-based evidence (SLEA §10.1). |
| **Instructor / Faculty** | Authors, teaches, and assesses courses and curricula. |
| **Institution Admin** | Governs an institution academy (SLEA Chapter 21). |
| **Issuer** | An authority that issues credentials (institution, community, platform, professional body). |
| **System AI / CRIE** | Non-human service principals that consume derived signals and orchestrate workflows (SLEA Chapter 13). |
| **Platform Admin** | Operates the SLE platform-wide and enforces governance (SLEA Chapter 15). |

## 1.4 Primary users

Students, researchers, lecturers, supervisors, mentors, and early-career
scholars who learn, assess, and accumulate credentials.

## 1.5 Secondary users

Faculty and department/institution administrators, credential verifiers,
professional bodies, employers, government and national bodies (aggregate
analytics), and AI service principals (CRIE, assistants).

## 1.6 System scope

In scope: the Learning Object Hierarchy, learning components, research
learning, assessment, competency, certification, mentorship, community
learning, events, analytics, adaptive learning, the academic portfolio,
institutional academies, and interoperability adapters.

## 1.7 Boundaries

Out of scope and **never duplicated** by the SLE (referenced by identity only):
researchers (Identity), publications (Publishing), journals, conferences,
institutions, groups, communities, messaging, notifications, activity, workflow
artefacts, and research projects (SLEA Chapters 11, 14).

## 1.8 Dependencies

- **Identity / Authentication** — learners are canonical researchers
  (username/SAID).
- **RBAC** — the platform permission hierarchy (SLEA §15).
- **Trust / Verification** — credential and issuer verification.
- **Activity / Notifications** — event emission and delivery.
- **Workflow (SWTROP)** — project-based learning artefacts and reviews.
- **Research Intelligence / Knowledge Graph / CRIE** — derived signals and
  orchestration (SLEA Chapter 13).
- **Marketplace** — commercial learning transactions.
- **Digital Twins** — future persistent learning state (Phase 5).

---

# Chapter 2 — Domain Model

All entities follow SLEA conventions: canonical references (never duplicated
records), derived aggregates, and learner-owned, consent-governed records
(SLEA §1, §14.1, §15.1). Forty-seven core entities are specified.

## 2.1 Learning hierarchy entities

| Entity | Description | SLEA |
|---|---|---|
| `Programme` | Top-level educational offering with a qualification intent. | Ch. 4 |
| `Curriculum` | Coherent body of learning under a programme. | Ch. 4 |
| `LearningPath` | Personalised, traversable sequence across courses/modules/topics. | Ch. 4 |
| `Course` | Self-contained teaching unit with outcomes and assessment. | Ch. 4 |
| `MicroCourse` | Short, focused course (hours/days) for targeted skills. | Ch. 5 |
| `Module` | Unit within a course or path. | Ch. 4 |
| `Lesson` | Single teaching session or object. | Ch. 4 |
| `Topic` | Concept unit within a lesson. | Ch. 4 |
| `LearningActivity` | Evidence-producing exercise. | Ch. 4 |
| `ReadingList` | Curated collection of canonical publications. | Ch. 5 |
| `ReadingPlaylist` | Ordered selection of learning objects and resources. | Ch. 5 |

## 2.2 Assessment entities

| Entity | Description | SLEA |
|---|---|---|
| `Assessment` | Measured evaluation against criteria. | Ch. 7 |
| `Quiz` | Question-based assessment subtype. | Ch. 7 |
| `Assignment` | Artefact-producing assessment subtype. | Ch. 7 |
| `Practical` | Performance-based assessment subtype. | Ch. 7 |
| `ResearchExercise` | Research-task assessment subtype. | Ch. 7 |
| `Reflection` | Structured learner reflection feeding self-regulation. | Ch. 4 |

## 2.3 Competency entities

| Entity | Description | SLEA |
|---|---|---|
| `Competency` | Demonstrable capability evidenced by activities/assessments. | Ch. 8 |
| `CompetencyFramework` | The unifying semantic layer of the SLE. | Ch. 8 |
| `Skill` | Applied, observable ability (input to competency). | Ch. 8 |
| `KnowledgeArea` | Declarative knowledge domain (input to competency). | Ch. 8 |
| `LearningOutcome` | Declared outcome of a learning object. | Ch. 4 |

## 2.4 Certification entities

| Entity | Description | SLEA |
|---|---|---|
| `Certificate` | Course/path completion credential. | Ch. 9 |
| `DigitalBadge` | Machine-verifiable competency/achievement credential. | Ch. 9 |
| `LearningPassport` | Learner-owned lifetime aggregation of learning and credentials. | Ch. 9 |
| `Portfolio` | Lifelong, derived, learner-owned evidence surface. | Ch. 19 |

## 2.5 Mentorship entities

| Entity | Description | SLEA |
|---|---|---|
| `Mentorship` | Governed mentor–mentee relationship with lifecycle. | Ch. 10 |
| `Mentor` | A researcher acting in a mentor role (supervisor, coach, etc.). | Ch. 10 |
| `Mentee` | A researcher learning under mentorship. | Ch. 10 |

## 2.6 Event entities

| Entity | Description | SLEA |
|---|---|---|
| `Workshop` | Hands-on skill session. | Ch. 12 |
| `Bootcamp` | Intensive practical training. | Ch. 12 |
| `Masterclass` | Expert-led deep session. | Ch. 12 |
| `Seminar` | Academic talk and discussion. | Ch. 12 |
| `SummerSchool` | Multi-day/term intensive learning. | Ch. 12 |
| `TrainingSeries` | Structured sequence of sessions. | Ch. 12 |

## 2.7 Analytics and adaptive entities

| Entity | Description | SLEA |
|---|---|---|
| `LearningAnalytics` | Derived learning-health indicators, learner to global scale. | Ch. 17 |
| `AdaptiveRecommendation` | A personalised, explainable adaptation signal. | Ch. 18 |
| `LearningProgress` | Evidence of traversal through the hierarchy. | Ch. 17 |
| `LearningHistory` | Append-only event record of learning. | Ch. 17 |
| `LearningGoal` | A learner-stated goal driving personalisation. | Ch. 18 |
| `CPDRecord` | Continuing professional development record. | Ch. 9 |

## 2.8 Institutional entities

| Entity | Description | SLEA |
|---|---|---|
| `InstitutionAcademy` | Institution-branded academy tenant. | Ch. 21 |
| `FacultyAcademy` | Faculty-level academy. | Ch. 21 |
| `DepartmentAcademy` | Department-level academy. | Ch. 21 |
| `DoctoralSchool` | Doctoral training governance surface. | Ch. 21 |
| `ResearchSchool` | Research capacity academy. | Ch. 21 |
| `VirtualResearchSchool` | Platform-wide research capacity school. | Ch. 21 |

---

# Chapter 3 — Database Specification

The schema follows the repository's `db/schema.sql` conventions: PostgreSQL,
UUID primary keys, `TIMESTAMPTZ` audit fields, `TEXT`-typed enums with CHECK
constraints, canonical researcher references by `username` (via a throwing
`researcherOf` projection — SLEA conventions), and append-only tables where
evidence integrity requires immutability. All tables are **append-only** in
the sense that rows are added and soft-deleted, never physically removed, and
content/credential tables are **versioned**. The schema is additive to
`db/schema.sql` under a `learning` prefix.

## 3.1 Cross-cutting conventions

- **Audit fields** — every table carries `created_at TIMESTAMPTZ NOT NULL
  DEFAULT NOW()` and `updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`; content,
  governance, and credential tables additionally carry `created_by UUID` and
  `updated_by UUID` referencing `users(id)`.
- **Soft delete** — every table carries `deleted_at TIMESTAMPTZ`; queries
  default-filter `deleted_at IS NULL`; hard deletes are prohibited for
  evidence, credential, history, and audit rows.
- **Versioning** — content and credential tables carry
  `version INTEGER NOT NULL DEFAULT 1`; content edits increment the version;
  every evidence/credential record references the exact content version in
  force when produced (SLEA §7.1, §15).
- **Canonical references** — learners (`learner_username`), mentors
  (`mentor_username`), institutions, publications, groups, and communities are
  referenced by canonical identity, never duplicated (SLEA §14.1).
- **Index naming** — `idx_<table>_<column>`.

## 3.2 Tables

| # | Table | Purpose | Primary Key | Foreign Keys | Indexes | Constraints / Notes |
|---|---|---|---|---|---|---|
| 1 | `learning_programme` | Top-level offering with qualification intent. | `id UUID` | `institution_id` (optional) | `idx_learning_programme_slug`, `idx_learning_programme_status` | `slug UNIQUE`; `status` check: draft, published, archived |
| 2 | `learning_curriculum` | Body of learning under a programme. | `id UUID` | `programme_id` | `idx_learning_curriculum_programme` | `programme_id NOT NULL`; ordering `position INT` |
| 3 | `learning_path` | Personalised traversable sequence. | `id UUID` | `owner_username` | `idx_learning_path_owner` | `is_public BOOLEAN`; `purpose TEXT` |
| 4 | `learning_path_item` | An item in a path referencing any hierarchy node. | `id UUID` | `path_id`, `node_type`, `node_id` | `idx_learning_path_item_path` | `position INT NOT NULL`; `node_id` polymorphic via `node_type` |
| 5 | `learning_course` | Self-contained teaching unit. | `id UUID` | `curriculum_id` | `idx_learning_course_curriculum`, `idx_learning_course_slug` | `slug UNIQUE`; `course_kind` check: standard, micro; `is_published` |
| 6 | `learning_module` | Unit within a course. | `id UUID` | `course_id` | `idx_learning_module_course` | `position INT`; `learning_outcome_ref` optional |
| 7 | `learning_lesson` | Single teaching session/object. | `id UUID` | `module_id` | `idx_learning_lesson_module` | `position INT`; `content_version INT` |
| 8 | `learning_topic` | Concept unit within a lesson. | `id UUID` | `lesson_id` | `idx_learning_topic_lesson` | `position INT` |
| 9 | `learning_activity` | Evidence-producing exercise. | `id UUID` | `topic_id` (or `lesson_id`) | `idx_learning_activity_topic` | `activity_kind` check: exercise, task, reading, discussion, project-step |
| 10 | `learning_reading_list` | Curated list of canonical publications. | `id UUID` | `owner_username` (optional) | `idx_learning_reading_list_owner` | `title`, `description` |
| 11 | `learning_reading_list_item` | A publication entry in a reading list. | `id UUID` | `reading_list_id` | `idx_reading_list_item_list` | `publication_identifier` (DOI) canonical reference |
| 12 | `learning_reading_playlist` | Ordered selection of learning objects/resources. | `id UUID` | `owner_username` | `idx_learning_playlist_owner` | `position` ordering of items |
| 13 | `learning_reading_playlist_item` | An item in a playlist. | `id UUID` | `playlist_id` | `idx_playlist_item_playlist` | `position INT`; `node_type` + `node_id` polymorphic |
| 14 | `learning_assessment` | Measured evaluation base. | `id UUID` | `learning_object_id` | `idx_learning_assessment_object` | `assessment_kind` check: quiz, assignment, practical, research-exercise; `rubric_id` |
| 15 | `learning_quiz` | Question-based assessment subtype. | `id UUID` | `assessment_id` | `idx_learning_quiz_assessment` | `pass_mark INT`; `time_limit_min INT` |
| 16 | `learning_assessment_question` | A quiz question. | `id UUID` | `quiz_id` | `idx_learning_question_quiz` | `question_type` check: mcq, true-false, short-answer |
| 17 | `learning_assignment` | Artefact-producing assessment subtype. | `id UUID` | `assessment_id` | `idx_learning_assignment_assessment` | `submission_type`; `due_offset` |
| 18 | `learning_practical` | Performance-based assessment subtype. | `id UUID` | `assessment_id` | `idx_learning_practical_assessment` | `checklist_id` optional |
| 19 | `learning_research_exercise` | Research-task assessment subtype. | `id UUID` | `assessment_id` | `idx_learning_research_exercise` | `lifecycle_stage_id` canonical (SLEA Ch. 6) |
| 20 | `learning_reflection` | Structured learner reflection. | `id UUID` | `learner_username`, `learning_object_id` | `idx_learning_reflection_learner` | append-only; feeds adaptive engine |
| 21 | `learning_rubric` | Transparent criterion-based scoring model. | `id UUID` | `owner_username` | `idx_learning_rubric_owner` | `version INT NOT NULL DEFAULT 1` |
| 22 | `learning_rubric_criterion` | A criterion row of a rubric. | `id UUID` | `rubric_id` | `idx_learning_rubric_criterion` | `level INT` maps to L1–L5 (SLEA §8.3) |
| 23 | `learning_assessment_result` | Evidence record of an assessment attempt. | `id UUID` | `learner_username`, `assessment_id` | `idx_learning_result_learner`, `idx_learning_result_assessment` | append-only; `rubric_id` + `rubric_version` frozen at attempt |
| 24 | `learning_competency_framework` | The competency model of the SLE. | `id UUID` | `owner_username` | `idx_learning_framework_owner` | `version INT NOT NULL DEFAULT 1` |
| 25 | `learning_competency_framework_level` | One progression level (L1–L5). | `id UUID` | `framework_id` | `idx_learning_framework_level` | `level INT 1..5 UNIQUE per framework` |
| 26 | `learning_competency` | A demonstrable capability. | `id UUID` | `framework_id` | `idx_learning_competency_framework`, `idx_learning_competency_key` | `key UNIQUE`; `domain` check (SLEA §8.2) |
| 27 | `learning_skill` | Applied, observable ability. | `id UUID` | — | `idx_learning_skill_key` | `key UNIQUE` |
| 28 | `learning_knowledge_area` | Declarative knowledge domain. | `id UUID` | — | `idx_learning_knowledge_area_key` | `key UNIQUE` |
| 29 | `learning_outcome` | Declared outcome of a learning object. | `id UUID` | `learning_object_id` | `idx_learning_outcome_object` | `outcome_type` |
| 30 | `learning_competency_link` | Many-to-many: competency ↔ learning object. | `id UUID` | `competency_id`, `learning_object_id` | `idx_learning_competency_link_competency`, `idx_learning_competency_link_object` | link type: develops, assesses, evidences, prerequisite |
| 31 | `learning_certificate` | Completion credential. | `id UUID` | `issuer_username`, `learner_username` | `idx_learning_certificate_learner` | `verification_reference UNIQUE` (SLEA §9) |
| 32 | `learning_digital_badge` | Machine-verifiable badge credential. | `id UUID` | `issuer_username`, `learner_username` | `idx_learning_badge_learner` | `badge_standard` (Open Badges adapter) |
| 33 | `learning_learning_passport` | Learner-owned lifetime aggregation. | `id UUID` | `learner_username` | `idx_learning_passport_learner` | one active record per learner |
| 34 | `learning_portfolio` | Derived lifelong evidence surface. | `id UUID` | `learner_username` | `idx_learning_portfolio_learner` | `portfolio_kind` check (SLEA §19.1) |
| 35 | `learning_portfolio_item` | A curated evidence entry in a portfolio. | `id UUID` | `portfolio_id` | `idx_learning_portfolio_item` | `evidence_ref` + `evidence_type` |
| 36 | `learning_credential_evidence` | Links a credential to its evidence chain. | `id UUID` | `credential_id`, `evidence_id` | `idx_learning_credential_evidence` | append-only (SLEA §9.1) |
| 37 | `learning_mentor` | Researcher acting in a mentor role profile. | `id UUID` | `mentor_username` | `idx_learning_mentor_username` | `mentor_kind` check (SLEA §10.1) |
| 38 | `learning_mentee` | Researcher learning under mentorship. | `id UUID` | `mentee_username` | `idx_learning_mentee_username` | `mentee_goals` |
| 39 | `learning_mentorship` | Governed mentorship relationship. | `id UUID` | `mentor_username`, `mentee_username` | `idx_learning_mentorship_mentor`, `idx_learning_mentorship_mentee` | `status` check: requested, matched, agreed, active, closed |
| 40 | `learning_event` | Time-boxed synchronous learning surface. | `id UUID` | `host_username`, `academy_id` (optional) | `idx_learning_event_host`, `idx_learning_event_kind` | `event_kind` check: workshop, bootcamp, masterclass, seminar, summer-school, training-series (SLEA Ch. 12) |
| 41 | `learning_event_attendance` | Attendance/completion evidence for an event. | `id UUID` | `event_id`, `learner_username` | `idx_learning_event_attendance` | consent-gated; append-only |
| 42 | `learning_enrollment` | Learner enrolment in a course/path. | `id UUID` | `learner_username`, `learning_object_id` | `idx_learning_enrollment_learner` | `status` check: enrolled, in-progress, completed, withdrawn |
| 43 | `learning_progress` | Evidence of hierarchy traversal. | `id UUID` | `learner_username`, `learning_object_id` | `idx_learning_progress_learner`, `idx_learning_progress_object` | derived-consistent; `progress_state` |
| 44 | `learning_history` | Append-only learning event log. | `id UUID` | `learner_username` | `idx_learning_history_learner`, `idx_learning_history_created` | append-only; canonical event types (SLEA §17.2) |
| 45 | `learning_goal` | Learner-stated goal. | `id UUID` | `learner_username` | `idx_learning_goal_learner` | `goal_status`; `target_competency` |
| 46 | `learning_analytics_snapshot` | Time-stamped, refreshable derived analytics cache. | `id UUID` | `scope_type`, `scope_id` | `idx_learning_analytics_scope` | explicitly cached; never authoritative (SLEA §17.4) |
| 47 | `learning_adaptive_recommendation` | Explainable personalisation signal. | `id UUID` | `learner_username` | `idx_learning_recommendation_learner` | `recommendation_kind` (SLEA §18.1); `reason_evidence` |
| 48 | `learning_cpd_record` | Continuing professional development record. | `id UUID` | `learner_username` | `idx_learning_cpd_learner` | `cpd_hours`; `evidence_ref`; portability via adapter |
| 49 | `institution_academy` | Branded academy tenant. | `id UUID` | `institution_id` | `idx_learning_academy_institution` | `academy_kind` check: institution, faculty, department, doctoral, research, virtual-research (SLEA §21.1) |
| 50 | `academy_membership` | Membership of an academy. | `id UUID` | `academy_id`, `member_username` | `idx_learning_academy_member` | `role` scoped by tenant policy |

**Table count: 50.**

## 3.3 Relationship summary

- **Hierarchy spine** — `learning_programme → learning_curriculum →
  learning_course → learning_module → learning_lesson → learning_topic →
  learning_activity`, each parent–child 1:N; `learning_path_item` and
  `learning_reading_playlist_item` reference any node polymorphically
  (`node_type` + `node_id`).
- **Competency web** — `learning_competency` belongs to
  `learning_competency_framework`; `learning_competency_link` connects
  competencies to learning objects; `learning_skill` and
  `learning_knowledge_area` feed competencies.
- **Assessment** — `learning_assessment` is the base; `learning_quiz`,
  `learning_assignment`, `learning_practical`, `learning_research_exercise`
  are 1:1 subtypes; results are append-only evidence referencing frozen
  rubric versions.
- **Credential chain** — certificates, badges, and CPD records reference
  `learning_credential_evidence`, `learning_learning_passport`, and
  `learning_portfolio`.
- **Personalisation** — `learning_goal`, `learning_progress`,
  `learning_history`, and `learning_adaptive_recommendation` feed the
  adaptive engine.

---

# Chapter 4 — Type Definitions

Types live in `types/learning.ts` (plus `types/learning-analytics.ts` and
`types/learning-portfolio.ts` for the derived surfaces), following the
module conventions of `types/communities.ts`. All interfaces are
**composition-based**, with inheritance shown explicitly.

## 4.1 Reusable base models

```ts
/** Canonical researcher reference — never duplicated. */
interface ResearcherRef {
  username: string;          // canonical researcher username (SAID)
  name?: string;
  avatarUrl?: string;
}

/** Shared audit fields (mirrors db/schema.sql). */
interface Auditable {
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

/** Soft-deletable + versioned record. */
interface Versioned {
  version: number;           // default 1
  deletedAt?: string | null; // soft delete
}

/** A reference to any node of the Learning Object Hierarchy (polymorphic). */
interface LearningObjectRef {
  nodeType: LearningNodeType;
  nodeId: string;
}

type LearningNodeType =
  | 'programme' | 'curriculum' | 'path' | 'course' | 'microCourse'
  | 'module' | 'lesson' | 'topic' | 'activity' | 'readingList'
  | 'readingPlaylist' | 'assessment';
```

## 4.2 Hierarchy types (inheritance)

```ts
/** Base node of the Learning Object Hierarchy (SLEA Ch. 4). */
interface LearningNode extends Auditable, Versioned {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  outcomes: LearningOutcome[];   // composition
}

interface Programme extends LearningNode {
  kind: 'programme';
  curricula: Curriculum[];       // composition
}

interface Curriculum extends LearningNode {
  kind: 'curriculum';
  programmeId: string;
  courses: Course[];
}

interface LearningPath extends Auditable, Versioned {
  id: string;
  ownerUsername: string;         // ResearcherRef
  purpose: string;
  items: { position: number; ref: LearningObjectRef }[];
  isPublic: boolean;
}

interface Course extends LearningNode {
  kind: 'course';
  curriculumId?: string;
  courseKind: 'standard' | 'micro';
  modules: Module[];
}

/** MicroCourse inherits Course shape (composition over deep inheritance). */
interface MicroCourse extends Course {
  courseKind: 'micro';
  durationHours: number;
}

interface Module extends LearningNode {
  kind: 'module';
  courseId: string;
  position: number;
  lessons: Lesson[];
}

interface Lesson extends LearningNode {
  kind: 'lesson';
  moduleId: string;
  position: number;
  contentVersion: number;
  topics: Topic[];
  readingListId?: string;
}

interface Topic extends LearningNode {
  kind: 'topic';
  lessonId: string;
  position: number;
  activities: LearningActivity[];
}

interface LearningActivity extends LearningNode {
  kind: 'activity';
  activityKind: 'exercise' | 'task' | 'reading' | 'discussion' | 'project-step';
  parent: LearningObjectRef;
  assessmentId?: string;
}
```

## 4.3 Assessment types (inheritance)

```ts
interface Assessment extends Auditable, Versioned {
  id: string;
  learningObjectId: string;
  assessmentKind: 'quiz' | 'assignment' | 'practical' | 'research-exercise';
  rubric: Rubric;                      // composition (SLEA §7)
  competencies: Competency[];          // assessed competencies
}

interface Quiz extends Assessment {
  assessmentKind: 'quiz';
  passMark: number;
  timeLimitMinutes?: number;
  questions: AssessmentQuestion[];
}

interface Assignment extends Assessment {
  assessmentKind: 'assignment';
  submissionType: 'document' | 'dataset' | 'artifact';
  dueOffset?: string;
}

interface Practical extends Assessment {
  assessmentKind: 'practical';
  checklist: string[];
}

/** Research learning maps to the canonical lifecycle (SLEA Ch. 6). */
interface ResearchExercise extends Assessment {
  assessmentKind: 'research-exercise';
  lifecycleStageId: string;            // canonical ResearchLifecycleStageId
}

interface AssessmentResult extends Auditable {
  id: string;
  learnerUsername: string;
  assessmentId: string;
  rubricId: string;
  rubricVersion: number;               // frozen at attempt
  score: number;
  evidence: { type: string; ref: string }[];
}
```

## 4.4 Competency types

```ts
interface CompetencyFramework extends Auditable, Versioned {
  id: string;
  name: string;
  levels: CompetencyLevel[];           // L1–L5
  competencies: Competency[];
}

interface CompetencyLevel {
  level: 1 | 2 | 3 | 4 | 5;
  name: string;                        // Foundational…Expert (SLEA §8.3)
}

type CompetencyDomain =
  | 'knowledge' | 'skills' | 'professional' | 'research' | 'digital'
  | 'teaching' | 'leadership' | 'innovation' | 'entrepreneurship';

interface Competency extends Auditable, Versioned {
  id: string;
  frameworkId: string;
  key: string;
  domain: CompetencyDomain;
  description: string;
  skills: Skill[];
  knowledgeAreas: KnowledgeArea[];
  prerequisites: string[];             // competency keys
}

interface Skill { id: string; key: string; name: string; }
interface KnowledgeArea { id: string; key: string; name: string; }
interface LearningOutcome { id: string; learningObjectId: string; statement: string; }
```

## 4.5 Credential types

```ts
interface Credential extends Auditable, Versioned {
  id: string;
  issuerUsername: string;
  learnerUsername: string;
  verificationReference: string;       // permanent (SLEA §9)
  evidence: CredentialEvidence[];
}

interface Certificate extends Credential {
  kind: 'certificate';
  learningObjectId: string;
}

interface DigitalBadge extends Credential {
  kind: 'digitalBadge';
  badgeStandard?: 'open-badges';
  imageUrl: string;
}

interface CPDRecord extends Credential {
  kind: 'cpd';
  hours: number;
  description: string;
}

interface LearningPassport {
  id: string;
  learnerUsername: string;
  credentials: Credential[];
  portfolioIds: string[];
}
```

## 4.6 Mentorship, events, academies

```ts
type MentorKind =
  | 'supervisor' | 'mentor' | 'coach' | 'peer-mentor'
  | 'industry-mentor' | 'institutional-mentor'
  | 'research-mentor' | 'community-mentor';          // SLEA §10.1

interface Mentor extends ResearcherRef { mentorKind: MentorKind; expertise: string[]; }
interface Mentee extends ResearcherRef { goals: string[]; }

interface Mentorship extends Auditable {
  id: string;
  mentor: Mentor;
  mentee: Mentee;
  status: 'requested' | 'matched' | 'agreed' | 'active' | 'closed';
  lifecycleStage: string;              // SLEA §10.3 phases
}

type LearningEventKind =
  | 'workshop' | 'bootcamp' | 'masterclass' | 'seminar'
  | 'summer-school' | 'training-series';             // SLEA Ch. 12

interface LearningEvent extends Auditable, Versioned {
  id: string;
  eventKind: LearningEventKind;
  host: ResearcherRef;
  academyId?: string;
  startAt: string;
  endAt: string;
  learningContract: { outcomes: string[]; credentialHooks: string[] };  // §12.1
}

type AcademyKind =
  | 'institution' | 'faculty' | 'department' | 'doctoral'
  | 'research' | 'virtual-research';                 // SLEA §21.1

interface Academy extends Auditable, Versioned {
  id: string;
  academyKind: AcademyKind;
  institutionId?: string;             // canonical institution reference
  branding: { name: string; theme: string };
  policyEnvelope: string[];           // tenant RBAC/QA policies (SLEA §21.3)
}
```

## 4.7 Analytics, adaptive, portfolio types

```ts
interface LearningAnalytics {
  scope: 'learner' | 'cohort' | 'faculty' | 'institution' | 'national' | 'global';
  scopeId: string;
  kpis: Partial<Record<KpiKey, number>>;   // SLEA §17.7
  generatedAt: string;
  evidenceVersion: number;
}

type KpiKey =
  | 'progressRate' | 'completionRate' | 'retentionRate' | 'engagementIndex'
  | 'learningVelocity' | 'competencyAttainment' | 'dropOffRisk' | 'interventionCoverage';

interface AdaptiveRecommendation extends Auditable {
  id: string;
  learnerUsername: string;
  kind: AdaptiveRecommendationKind;    // SLEA §18.1 (16 capabilities)
  target: LearningObjectRef;
  reasonEvidence: string[];            // explainable (SLEA §18.3)
}

type AdaptiveRecommendationKind =
  | 'path' | 'sequence' | 'assessment' | 'reading-list' | 'research-training'
  | 'career' | 'cpd' | 'intervention';

interface Portfolio extends Auditable {
  id: string;
  learnerUsername: string;
  kind: PortfolioKind;                 // SLEA §19.1 (16 surfaces)
  items: PortfolioItem[];
}

interface PortfolioItem {
  id: string;
  evidenceRef: string;
  evidenceType: string;
  visibility: 'private' | 'shared' | 'public';
  sharedWith?: string[];               // consent-based (SLEA §19.2)
}
```

## 4.8 Service-level models

```ts
interface LearningGoal extends Auditable {
  id: string;
  learnerUsername: string;
  statement: string;
  targetCompetencies: string[];
  status: 'active' | 'achieved' | 'dropped';
}

interface LearningProgress {
  learnerUsername: string;
  learningObjectId: string;
  progressState: 'not-started' | 'in-progress' | 'completed';
  completedAt?: string;
}

interface LearningHistoryEntry extends Auditable {
  id: string;
  learnerUsername: string;
  eventType: LearningHistoryEventType;  // canonical (SLEA §17.2)
  payload: Record<string, unknown>;
}
```

---

# Chapter 5 — Business Services

Services are **pure, framework-free engines** in `lib/` (mirroring
`lib/collaboration.ts`, `lib/communities.ts` conventions): no React, no state,
no side effects; they derive and transform canonical records. They are
re-exported explicitly from `lib/index.ts` by name. **Thirteen services** are
specified.

| Service | Responsibility | Representative functions |
|---|---|---|
| `LearningService` | Hierarchy navigation, enrolment, progress. | `treeOf`, `enrol`, `advanceProgress`, `completeObject`, `hierarchyForLearner` |
| `CourseService` | Course/lesson/topic lifecycle. | `coursesFor`, `courseModules`, `lessonsForModule`, `topicsForLesson`, `courseProgress` |
| `CurriculumService` | Programme→curriculum composition. | `programmes`, `curriculaForProgramme`, `curriculumCourses`, `programmeProgress` |
| `AssessmentService` | Assessment, results, rubric scoring. | `assessmentsFor`, `attemptAssessment`, `scoreByRubric`, `assessmentResultsFor` |
| `CertificateService` | Credential issuance and verification. | `issueCertificate`, `issueBadge`, `verificationReference`, `verifyCredential` |
| `CompetencyService` | Competency mapping and growth. | `competencyModel`, `competencyLinksFor`, `evidenceToCompetency`, `competencyLevelFor`, `gapAnalysis` |
| `MentorshipService` | Mentor/mentee lifecycle. | `requestMatch`, `recommendMentors`, `lifecycleStage`, `mentorshipFor`, `closeMentorship` |
| `PortfolioService` | Derived portfolio surfaces. | `portfolioFor`, `portfolioKind`, `sharePortfolio`, `revokeSharing`, `exportPortfolio` |
| `AnalyticsService` | Derived analytics and KPIs. | `analyticsFor`, `rollup`, `computeKpis`, `riskSignals`, `interventionList` |
| `AdaptiveLearningService` | Personalisation engine. | `diagnose`, `planPath`, `reorderSequence`, `nextBestLearning`, `explainRecommendation` |
| `RecommendationService` | Derived recommendations. | `recommendationsFor`, `rankByFit`, `filterByConsent`, `recommendIntervention` |
| `InstitutionLearningService` | Academy tenants and policies. | `academiesFor`, `academyKinds`, `tenantPolicy`, `academyMembers`, `institutionAnalytics` |
| `CPDService` | CPD records and portability. | `cpdRecordsFor`, `addCpdRecord`, `cpdSummary`, `exportCpd` |

All services operate **by reference** (canonical researcher usernames, SAIDs,
DOIs, content node IDs) and **derive aggregates**; none writes or duplicates
another module's records (SLEA §14.1). Assessment and credential services
enforce **human authority**: they never self-issue credentials or finalise
grades on AI output (SLEA §7.1, §9.1).

---

# Chapter 6 — Hooks

Client state layers in `hooks/` (registered in `hooks/index.ts`), following
`useCollaboration.ts` / `useCommunities.ts` conventions: hold local state
seeded from placeholder graphs, expose view state, controls, and actions, and
resolve identity to the canonical current user (`ojuri`, Dr. Adebisi Ojurere).
**Ten hooks** are specified.

| Hook | View state | Controls | Actions |
|---|---|---|---|
| `useLearning` | `tree`, `hierarchy`, `myEnrolments`, `progress`, `currentUser` | `query`, `setQuery`, `filter`, `setFilter` | `enrol`, `completeObject`, `resume` |
| `useCourses` | `courses`, `filtered`, `searchResults`, `myCourses` | `query`, `category`, `sort` | `enrolCourse`, `openCourse` |
| `useCurriculum` | `programmes`, `curricula`, `courseMap` | `programme`, `setProgramme` | `navigateProgramme`, `selectCurriculum` |
| `useCompetencies` | `framework`, `competencies`, `learnerCompetencyLevels`, `gaps` | `domain`, `setDomain`, `level`, `setLevel` | `refreshEvidence`, `focusGap` |
| `useCertificates` | `certificates`, `badges`, `passport`, `verificationStatus` | `kind`, `setKind` | `verifyCredential`, `exportCredential` |
| `useMentorship` | `mentorships`, `mentors`, `recommended`, `activeLifecycle` | `role`, `setRole`, `status`, `setStatus` | `requestMatch`, `acceptMatch`, `closeMentorship` |
| `usePortfolio` | `portfolios`, `selected`, `visibleItems`, `analytics` | `kind`, `setKind`, `visibility`, `setVisibility` | `shareItem`, `revokeShare`, `exportPortfolio` |
| `useAssessments` | `assessments`, `results`, `rubrics`, `pendingAttempts` | `type`, `setType`, `status`, `setStatus` | `startAttempt`, `submitAttempt`, `viewResult` |
| `useAnalytics` | `analytics`, `kpis`, `rollup`, `riskAlerts`, `dashboards` | `scope`, `setScope`, `period`, `setPeriod` | `refreshAnalytics`, `openDrillThrough` |
| `useRecommendations` | `recommendations`, `adaptiveState`, `explanations` | `kind`, `setKind`, `applied`, `setApplied` | `applyRecommendation`, `dismissRecommendation` |

Hooks **never own data**: they seed from placeholder constants and delegate
derivation to the business services (SLEA conventions). All personalisation
respects the consent model.

---

# Chapter 7 — Components

Components live in `components/learning/`, re-exported from
`components/learning/index.ts` (explicit, excluding barrel — module
convention), and consume existing UI primitives (`PageLayout`, `PageHeader`,
`SectionTitle`, `Alert`, `Button`, `Container`, `StatisticCard`, `Badge`,
`SearchBox`, `Select`). **Twenty-four feature components** are specified in a
three-tier hierarchy.

```
UI primitives (shared) 
  → learning layout (PageHeader, hub chrome, cross-module nav)
  → feature components (24)
      ├── browsing & hierarchy
      │     CourseBrowser, CourseCard, CoursePlayer, LessonViewer,
      │     CurriculumTree, LearningTimeline, ReadingList, ReadingPlaylist
      ├── competency & credentials
      │     CompetencyRadar, CertificateViewer, BadgeViewer,
      │     PortfolioViewer, LearningPassportViewer
      ├── assessment & mentorship
      │     AssessmentPlayer, QuizPlayer, AssignmentViewer,
      │     MentorshipDashboard, MentorProfile
      └── analytics, adaptive & institution
            LearningDashboard, LearningAnalyticsDashboard,
            AdaptiveRecommendationPanel, InstitutionAcademyDashboard,
            DoctoralSchoolDashboard, ResearchSchoolDashboard
```

| Component | Responsibility |
|---|---|
| `LearningDashboard` | The SLE hub — overview, KPIs, featured paths, cross-module navigation (SLEA §17.6). |
| `CourseCard` | Canonical course summary card — badges, outcomes, progress, link. |
| `CourseBrowser` | Interactive course centre — search, filters, sort, grid. |
| `CoursePlayer` | The learning surface — module/lesson navigation, progress. |
| `LessonViewer` | Renders a lesson, topics, activities, and links to reading/assessment. |
| `CurriculumTree` | Visual hierarchy Programme→Course→Module (SLEA Ch. 4). |
| `LearningTimeline` | Chronological learning history and milestones. |
| `ReadingList` | Curated canonical publication list (DOI references). |
| `ReadingPlaylist` | Ordered learning-object playlist with position controls. |
| `CompetencyRadar` | Radar of competency domain attainment (L1–L5) (SLEA §8.3). |
| `CertificateViewer` | Certificate display with verification reference. |
| `BadgeViewer` | Digital badge gallery with standard metadata. |
| `PortfolioViewer` | A derived portfolio surface with sharing controls (SLEA Ch. 19). |
| `LearningPassportViewer` | The lifelong credential aggregation surface. |
| `AssessmentPlayer` | Assessment runner — rubric, evidence, result display (SLEA Ch. 7). |
| `QuizPlayer` | Question-by-question quiz interface. |
| `AssignmentViewer` | Artefact submission and supervisor feedback view. |
| `MentorshipDashboard` | Mentor/mentee lifecycle, sessions, assessments (SLEA Ch. 10). |
| `MentorProfile` | Mentor role profile with expertise and capacity. |
| `LearningAnalyticsDashboard` | Role-scoped KPI dashboards (SLEA §17.6). |
| `AdaptiveRecommendationPanel` | Explainable recommendations with apply/dismiss (SLEA §18.3). |
| `InstitutionAcademyDashboard` | Tenant analytics and governance view (SLEA §21.2). |
| `DoctoralSchoolDashboard` | Doctoral training, supervision, portfolio view (SLEA §21.1). |
| `ResearchSchoolDashboard` | Research capacity academy view (SLEA §21.1). |

Components **never own data** — the browser wires the hook, the hook seeds from
placeholder data (SLEA conventions).

---

# Chapter 8 — Routes

All routes are **Server Components** under `app/learning/`, following the page
conventions in `node_modules/next/dist/docs` (`params`/`searchParams` are
promises; static pages without request-time APIs prerender). **Twenty routes**
are specified.

| Route | Page | Section |
|---|---|---|
| `/learning` | `app/learning/page.tsx` | Hub — overview, KPIs, featured paths, cross-module nav. |
| `/learning/dashboard` | `app/learning/dashboard/page.tsx` | `LearningDashboard` — progress, KPIs, recommendations. |
| `/learning/programmes` | `app/learning/programmes/page.tsx` | Programme directory. |
| `/learning/courses` | `app/learning/courses/page.tsx` | `CourseBrowser` centre. |
| `/learning/course/[slug]` | `app/learning/course/[slug]/page.tsx` | Course detail — modules, progress, enrolment. |
| `/learning/modules` | `app/learning/modules/page.tsx` | Module index. |
| `/learning/lessons` | `app/learning/lessons/page.tsx` | Lesson index. |
| `/learning/pathways` | `app/learning/pathways/page.tsx` | Learning paths and path builder. |
| `/learning/competencies` | `app/learning/competencies/page.tsx` | Competency framework and radar. |
| `/learning/certificates` | `app/learning/certificates/page.tsx` | Credential gallery and verification. |
| `/learning/badges` | `app/learning/badges/page.tsx` | Digital badge gallery. |
| `/learning/portfolio` | `app/learning/portfolio/page.tsx` | Portfolio surfaces and sharing. |
| `/learning/analytics` | `app/learning/analytics/page.tsx` | Role-scoped analytics dashboards. |
| `/learning/assessments` | `app/learning/assessments/page.tsx` | Assessment centre and results. |
| `/learning/mentorship` | `app/learning/mentorship/page.tsx` | Mentorship dashboard and matching. |
| `/learning/cpd` | `app/learning/cpd/page.tsx` | CPD records. |
| `/learning/institutions` | `app/learning/institutions/page.tsx` | Institution academies directory. |
| `/learning/research-school` | `app/learning/research-school/page.tsx` | Research school dashboard. |
| `/learning/doctoral-school` | `app/learning/doctoral-school/page.tsx` | Doctoral school dashboard. |

Cross-module navigation follows the existing `Button href` pattern used by the
hub surfaces (Messages, Activity, Notifications, Collaboration).

---

# Chapter 9 — Permissions

The SLE extends the platform RBAC model (`docs/RBAC.md` — 10-role hierarchy,
`PermissionKey` catalog, verification gating). It adds a **learning permission
group** and maps the eleven principals defined for the SLE.

## 9.1 Learning permission keys

```
learning:read        learning:enrol      learning:learn
learning:assess      learning:assess-submit
learning:author      learning:publish-content
learning:issue-credential  learning:verify-credential
learning:manage-mentorship  learning:mentor
learning:manage-academy    learning:admin-academy
learning:view-analytics    learning:view-learner-analytics
learning:consent     learning:manage-consent
learning:ai          learning:crie-orchestrate
```

## 9.2 Principal matrix

| Principal | Direct permissions | Notes |
|---|---|---|
| **Student** | `learning:read`, `learning:enrol`, `learning:learn`, `learning:assess`, `learning:assess-submit`, `learning:consent` | Inherits Visitor. |
| **Researcher** | Student permissions + `learning:author` | Same base as Lecturer in the RBAC hierarchy. |
| **Lecturer** | Researcher + `learning:publish-content`, `learning:assess` (instructor scope) | Course authoring. |
| **Supervisor** | Lecturer + `learning:manage-mentorship`, `learning:mentor`, `learning:view-learner-analytics` (mentees) | SLEA Ch. 10. |
| **Mentor** | `learning:read`, `learning:mentor`, `learning:view-learner-analytics` (mentees), `learning:consent` | SLEA §10.1. |
| **Institution Admin** | `learning:manage-academy`, `learning:admin-academy`, `learning:view-analytics`, `learning:issue-credential`, `learning:verify-credential` | SLEA §21.3. |
| **Faculty Admin** | `learning:manage-academy`, `learning:view-analytics`, `learning:issue-credential` (faculty scope) | SLEA §21.1. |
| **Department Admin** | `learning:manage-academy`, `learning:view-analytics` (department scope) | SLEA §21.1. |
| **Platform Admin** | All learning permission keys | Top of hierarchy. |
| **System AI** | `learning:ai`, `learning:read` (derived surfaces), never `learning:issue-credential` | AI is advisory (SLEA §13.2). |
| **CRIE** | `learning:read` (derived signals), `learning:crie-orchestrate`, never credential issuance | Orchestration only (SLEA §13.1). |

All checks run through `can({ roles, verificationLevel, permission })`; the
verification gate applies (records require an email-verified account). System
AI and CRIE are non-human service principals without credential authority.

---

# Chapter 10 — Workflows

**Eleven workflows** are specified. Each follows the derived-first, human-authority,
consent-governed conventions (SLEA §§7.1, 9.1, 15).

| Workflow | Steps |
|---|---|
| **Course Enrolment** | Discover (browse/search) → View eligibility (prerequisites, SLEA §18.3) → Consent (privacy) → Enrol (`learning_enrollment`) → Notify (Notifications) → Start (progress created). |
| **Course Completion** | Traverse hierarchy → Evidence activities → Pass assessments (rubric) → Reflect → Progress derived complete → Notify → Eligible for credential. |
| **Assessment** | Author rubric → Set assessment + competency links → Learner attempts (`AssessmentPlayer`) → Score by rubric (frozen version) → Result evidence appended → Competency evaluation (SLEA Ch. 7). |
| **Certification** | Evidence chain complete → Issuer authority verified (Trust) → Issue credential + verification reference → Bind evidence (`learning_credential_evidence`) → Learner receives (Notifications) → Verifiable externally. |
| **Badge Issuance** | Competency/badge criteria met → Issuer verifies → Badge issued (Open Badges adapter, SLEA §22) → Passport updated. |
| **Competency Progression** | Evidence → `CompetencyService.evidenceToCompetency` → Level threshold check (rubric) → Level updated (derived) → Recommendation feedback (SLEA §8.3). |
| **Mentorship** | Request → Match (derived recommendation, consent) → Agree → Engage → Assess → Reflect → Review → Close (SLEA §10.3). |
| **Research Training** | Research learning unit selected → Live research project referenced → Project-based activities → Supervisor assessment → Portfolio evidence (SLEA Ch. 6). |
| **Portfolio Update** | Evidence appended → Portfolio surfaces derived → Learner curates visibility → Sharing/revocation (consent) → Export available (SLEA Ch. 19). |
| **Learning Recommendation** | Analytics signal → Recommendation derived (`RecommendationService`) → Explained → Learner applies/dismisses → Feedback loop (SLEA §18.3). |
| **Adaptive Learning** | Observe → Diagnose → Plan → Adapt → Assess → Reflect → Learn (SLEA §18.2). |

---

# Chapter 11 — AI Integration

All AI integration is **derived-first (SADR-006), governed, and labelled**
(SLEA §13.2). The SLE exposes stable input/output contracts; AI never owns
learning records and never issues credentials. **Eight interfaces** are
specified.

| Interface | Contract | AI constraints |
|---|---|---|
| **CRIE** | Consumes derived analytics (17) and emits orchestration directives to adaptive workflows (18). | Orchestration only; no credential authority. |
| **Research Writing Studio** | Learning references workflow artefacts; writing feedback returns as labelled evidence. | Model output labelled; human finalises. |
| **Knowledge Graph** | Typed learning nodes/edges exported as graph-ready data (JSON-LD adapter, SLEA §22). | Graph reflects derived state only. |
| **Recommendation Engine** | Consumes `RecommendationService` signals; recommends next-best-learning. | Recommendations explained and dismissible. |
| **Learning Analytics** | Stable analytics contract feeding AI risk/drop-off/summary signals. | Model signals labelled; derived base authoritative. |
| **Adaptive Learning** | `AdaptiveLearningService` exposes diagnose/plan/adapt contracts. | Fallback-safe; human authority preserved. |
| **Citation Intelligence** | Citation guidance tied to reading lists and learner evidence. | Advisory; references canonical DOIs. |
| **Research Intelligence** | Trends/gaps/expertise feed curricula and research learning (SLEA Ch. 20). | Derived from canonical modules. |

---

# Chapter 12 — Cross-Module Integration

Integration is **by reference and event, never duplication** (SLEA §14.1).
**Fourteen modules** are specified.

| Module | Integration points | Data flow |
|---|---|---|
| **Identity** | Learners are canonical researcher identities (username/SAID). | Records reference learners; never copies. |
| **Trust** | Issuer and mentor authority. | Credentials consumed for verification. |
| **Verification** | Permanent verification references on credentials. | Verification surface validates credentials. |
| **Publishing** | Publication skills learning; writing feedback on manuscripts. | Learning references publications; artefacts feed portfolios. |
| **Marketplace** | Paid courses, academies, services. | Commerce completes learning transactions. |
| **Groups** | Cohort learning, shared curricula. | Learning attaches to group entities. |
| **Communities** | Community learning, community mentors. | Learning attaches to community entities. |
| **Messaging** | Mentor–learner coordination. | Mentorship session coordination. |
| **Notifications** | Milestones, results, event reminders. | Learning emits notification events. |
| **Workflow (SWTROP)** | Artefacts, tasks, reviews for project-based learning. | Workflow executes learning tasks; artefacts are evidence. |
| **Activity** | Learning actions in the platform event stream. | Learning emits activity events. |
| **Research Projects** | Research-based learning on live projects. | Projects provide context and evidence. |
| **Research Intelligence** | Trends, gaps, expertise matches. | Intelligence feeds recommendations and curricula. |
| **Digital Twins** | Personalised, persistent learning state. | Digital Twin consumes consented learning signals (Phase 5). |

---

# Chapter 13 — Placeholder Data

Placeholder constants live in `constants/placeholder-learning.ts` (plus
`placeholder-learning-analytics.ts` and `placeholder-learning-portfolio.ts`
for derived surfaces), mirroring the placeholder module conventions. **Ten
datasets** are required. All learner references resolve canonical researchers
via the throwing `researcherOf()` helper; publication references use canonical
DOIs.

| Dataset | Contents |
|---|---|
| **Programmes** | 2–3 programmes, each with curricula, referencing canonical institutions. |
| **Courses** | 6–8 courses (incl. 2–3 micro courses) across research, professional, and digital domains. |
| **Lessons** | 10+ lessons nested in modules with topics and activities. |
| **Assessments** | Quizzes, assignments, practicals, research exercises with rubrics (L1–L5). |
| **Competencies** | A competency framework with domains, L1–L5 levels, skills, knowledge areas, links. |
| **Certificates** | Example certificates, badges, and a Learning Passport for the current user. |
| **Mentors** | Mentor role profiles of all eight kinds referencing canonical researchers. |
| **Institutions** | Academy tenants of each kind referencing canonical institutions. |
| **Badges** | Digital badge examples with Open Badges metadata. |
| **Learning Paths** | Personalised paths for the focus researcher with items across the hierarchy. |

Derived surfaces (analytics KPIs, adaptive recommendations, portfolio items)
are computed by the services from the placeholder graph — never hand-maintained
(SADR-006).

---

# Chapter 14 — Implementation Breakdown

Implementation is decomposed into seven logical engineering phases, each with
deliverables and exit criteria. Phases may be sequenced across commits under
the governance rules.

| Phase | Scope | Deliverables | Exit criteria |
|---|---|---|---|
| **A — Core Types** | `types/learning.ts` (+ analytics, portfolio) | Entity model, vocabularies, reusable models (Ch. 4) | `tsc --noEmit` clean; no circular imports. |
| **B — Business Engine** | `lib/learning.ts` etc. (13 services) | Pure engine + `lib/index.ts` re-exports (Ch. 5) | Engine derives without side effects; no React. |
| **C — Hooks** | `hooks/useLearning.ts` etc. (10 hooks) | Client state layers registered in `hooks/index.ts` (Ch. 6) | Hooks wire to placeholder + engine; no data ownership. |
| **D — Components** | `components/learning/*` | 24 feature components + barrel (Ch. 7) | Reuse UI primitives; lint clean. |
| **E — Routes** | `app/learning/*` (20 routes) | Server-component pages (Ch. 8) | All routes render; `npm run build` passes. |
| **F — Integration** | Cross-module wiring | Groups/Communities/Workflow/Intelligence/Notifications hooks, nav integration | No duplicate records; references verified. |
| **G — Verification** | Full verification pass | Chapter 15 checklist executed | All checks green. |

Each phase is **additive** and preserves the constitutional invariants
(reference over copy, derived analytics, consent privacy, human authority,
CRIE-ready contracts).

---

# Chapter 15 — Verification Checklist

The implementation must pass every item before the phase closes (SLEA
conventions and repository governance).

| Area | Checks |
|---|---|
| **TypeScript** | `npx tsc --noEmit` — 0 errors; no `any` leaks; strict mode; no circular imports. |
| **Lint** | `npm run lint` — 0 errors; only pre-approved warnings (if any). |
| **Build** | `npm run build` — all routes build; 0 failed pages; static prerender verified. |
| **Routes** | All 20 `/learning` routes reachable; dynamic `[slug]` resolves; cross-module links valid. |
| **Accessibility** | Semantic HTML; keyboard navigable; labelled controls; contrast (SLEA §15 accessibility). |
| **Performance** | No client bundles for static surfaces; derived analytics cheap; no N+1 patterns. |
| **Security** | RBAC-gated actions; verification gate applied; no secrets; no unsafe input sinks. |
| **Integration** | No duplicate records; canonical references resolve; events/notifications flow; consent enforced. |
| **Regression** | Existing modules unaffected; route matrix updated; `git status` clean at close. |

---

# Chapter 16 — Governance Updates

The following governance documents **will require updates during
implementation** of Phase 2.2G.3. They are **identified only — not updated by
this mission**:

| Document | Expected update |
|---|---|
| `docs/governance/IMPLEMENTATION_REGISTER.md` | Phase 2.2G.3 row (commit hash, tag, verification, summary). |
| `docs/ROUTE_MATRIX.md` | Register the 20 `/learning` routes. |
| `docs/PHASE_ROADMAP.md` | Phase 2.2G.3 complete; next phase ready; move Learning out of Planned. |
| `docs/governance/ARCHITECTURE_REPOSITORY_REGISTER.md` | Register the learning architecture + functional specification. |
| `docs/governance/AI_KNOWLEDGE_REGISTER.md` | Register learning AI capabilities and CRIE interfaces. |
| `docs/governance/SADR_REGISTER.md` | Record any new SADRs introduced during implementation. |
| `docs/governance/REQUIREMENTS_TRACEABILITY_REGISTER.md` | Trace learning requirements to SLEA chapters. |
| `docs/governance/IMPLEMENTATION_COMPLIANCE_ENGINE.md` | Add Learning to verified module inventory. |
| `docs/governance/REPOSITORY_GOVERNANCE_AUDITOR.md` | Include Learning in governance audits. |

---

# Chapter 17 — Architecture Conformance

This specification conforms to `docs/LEARNING_ECOSYSTEM_ARCHITECTURE.md`
(SLEA) as follows:

| Functional spec chapter | SLEA reference | Conformance |
|---|---|---|
| Ch. 1 System Overview | §§1.1–1.5, Ch. 2 | Consistent |
| Ch. 2 Domain Model | Ch. 4–12, 19, 21 | Consistent |
| Ch. 3 Database | Ch. 4, 9, 15 (§audit/version/soft-delete) | Consistent |
| Ch. 4 Type Definitions | Ch. 4, 7, 8, 9, 10, 12, 19 | Consistent |
| Ch. 5 Business Services | Ch. 5–10, 17–19 | Consistent |
| Ch. 6 Hooks | SLEA conventions | Consistent |
| Ch. 7 Components | Ch. 4–10, 17–19, 21 | Consistent |
| Ch. 8 Routes | Ch. 4–12, 17–21 | Consistent |
| Ch. 9 Permissions | Ch. 15 + RBAC | Consistent |
| Ch. 10 Workflows | Ch. 7, 9, 10, 18 | Consistent |
| Ch. 11 AI Integration | Ch. 13 | Consistent |
| Ch. 12 Cross-Module Integration | Ch. 14 | Consistent |
| Ch. 13 Placeholder Data | SLEA conventions (SADR-006) | Consistent |
| Ch. 14 Implementation Breakdown | Ch. 16, 23 (additive) | Consistent |
| Ch. 15 Verification Checklist | Ch. 15 (production-grade) | Consistent |
| Ch. 16 Governance Updates | repository governance | Consistent |

**No contradictions** exist between this specification and the SLEA. The
specification adds no new constitutional principles and removes none.

---

*End of Functional Specification. No implementation, no code, no routes, no
components, no commits, and no governance updates are derived from this
document. Implementation begins with Mission 003-C.*
