# Scholatia Scholarly Learning Ecosystem Architecture (SLEA)

**Document:** `docs/LEARNING_ECOSYSTEM_ARCHITECTURE.md`
**Mission:** Mission 003-A — Scholarly Learning Ecosystem Architecture (SLEA)
**Status:** Constitutional blueprint — ratified. No implementation derived from
this document until the functional specification (Mission 003-B) is produced and
approved.
**Scope:** Architecture and systems engineering only.

---

## Document Status & Usage

This document is the **permanent constitutional blueprint** for the Scholarly
Learning Ecosystem (SLE) of Scholatia. It is deliberately **not** an
implementation task:

- No production code shall be written from this document.
- No routes shall be created.
- No components shall be implemented.
- No commits or governance updates are derived from this document alone.

Its purpose is to fix the architectural invariants, entity boundaries, and
integration contracts that every future Learning feature must honour. The
functional specification (Mission 003-B) will translate the chapters below into
concrete functional requirements; implementation phases will then realise them
module by module, following the repository's governance rules and the existing
module conventions (pure engines, derived aggregates, canonical references).

Every Learning feature, from a single lesson to the Global Learning Network,
must be traceable to a chapter in this document.

## Architectural Requirements & Constraints

The SLE shall be engineered as a system that is:

- **Platform-wide** — a first-class module of the Scholatia ecosystem, not an
  isolated silo; every learning record interoperates with identity, trust,
  publishing, collaboration, and intelligence surfaces.
- **Technology-neutral** — the architecture describes behaviour, contracts, and
  invariants, never a specific framework, library, database, or model vendor.
- **Future-proof** — designed to absorb new learning formats, assessment
  science, credential standards, and AI capabilities without re-architecting.
- **AI-ready** — every surface is designed so that derived or model-based
  intelligence can attach without changing the entity model.
- **Knowledge-graph-ready** — every entity carries stable identities so the
  ecosystem Knowledge Graph can connect learners, competencies, learning
  objects, mentors, and credentials.
- **CRIE-ready** — the orchestration intelligence layer (CRIE) can consume and
  emit learning signals without owning learning records.
- **Scalable** — from a single learner to global higher education scale;
  aggregates are derived, never stored as hand-maintained counts.
- **Modular** — each learning capability is an additive module with explicit
  boundaries; modules reference, never duplicate, canonical records.
- **Production-grade** — governed by explicit permissions, moderation, privacy,
  integrity, ethics, accessibility, quality assurance, audit, and versioning.
- **Designed for global higher education** — supports formal, informal,
  non-formal, and lifelong learning across institutions, disciplines,
  languages, and career stages.

---

## Table of Contents

- Document Status & Usage
- Architectural Requirements & Constraints
- Chapter 1 — Vision, Mission, Purpose, Educational Philosophy, Guiding Principles
- Chapter 2 — System Goals
- Chapter 3 — Learning Model
- Chapter 4 — Learning Object Hierarchy
- Chapter 5 — Learning Components
- Chapter 6 — Research Learning
- Chapter 7 — Assessment Architecture
- Chapter 8 — Competency Framework
- Chapter 9 — Certification Architecture
- Chapter 10 — Mentorship Architecture
- Chapter 11 — Community Learning
- Chapter 12 — Events
- Chapter 13 — AI Integration (CRIE)
- Chapter 14 — Cross-Module Integration
- Chapter 15 — Governance
- Chapter 16 — Future Expansion
- Chapter 17 — Learning Analytics Architecture
- Chapter 18 — Adaptive Learning Architecture
- Chapter 19 — Academic Portfolio Architecture
- Chapter 20 — Research Intelligence Integration
- Chapter 21 — Institutional Learning Architecture
- Chapter 22 — Global Interoperability Architecture
- Chapter 23 — Long-Term Vision
- Appendix A — Glossary
- Appendix B — Traceability

---

# Chapter 1 — Vision, Mission, Purpose, Educational Philosophy, Guiding Principles

## 1.1 Vision

A world in which every scholar — at every stage of their journey, in every
discipline, in every region — can **learn continuously, be assessed fairly, and
be certified credibly** within one open scholarly ecosystem.

## 1.2 Mission

To build the learning layer of Scholatia: an open, competency-driven, AI-augmented
learning ecosystem that develops research capacity, professional competence, and
lifelong curiosity in every member of the scholarly community, interoperating
with the full breadth of the platform — identity, trust, publishing,
collaboration, communities, mentorship, and intelligence.

## 1.3 Purpose

The SLE exists to close the gap between **scholarly activity** and **scholarly
capability**. Where the rest of Scholatia records what researchers do, the SLE
equips them to do it better. Its purpose is to:

1. Provide a structured surface for acquiring and evidencing research,
   teaching, professional, digital, leadership, innovation, and entrepreneurial
   competence.
2. Certify learning through an interoperable credential layer — certificates,
   micro credentials, badges, transcripts, CPD records, and the Learning
   Passport.
3. Connect learning to the rest of the ecosystem so that every lesson can
   reference real scholarship, every assessment can feed the researcher's
   record, and every credential can be verified by any institution.
4. Serve as the educational counterpart to the Research Lifecycle — a scholar
   learns to perform every stage of research before and while performing it.

## 1.4 Educational Philosophy

The SLE is grounded in an explicit educational philosophy:

- **Scholar-centred** — the learner owns their learning record, pace, and
  pathway; the platform serves, it does not prescribe.
- **Competency-based** — progression is measured by demonstrated competence,
  not seat time.
- **Lifelong by design** — learning objects and credentials are organised so a
  learner can return across a decades-long career without losing credit.
- **Open knowledge sharing** — learning content reuses and feeds the open
  scholarship of the platform; closed, duplicated content silos are
  anti-patterns.
- **Evidence-based** — every assessment conclusion, recommendation, and
  credential decision is anchored in evidence (artefacts, rubrics, portfolios,
  and derived analytics), never opinion.
- **Human-meaningful, AI-assisted** — AI amplifies the learner and the mentor;
  it never replaces academic judgement or the authority of the issuing body.
- **Integration over isolation** — learning is strongest when it happens inside
  the surfaces where scholarship already occurs — communities, groups, labs,
  journals, conferences, and workspaces.

## 1.5 Guiding Principles

The ten constitutional principles of the SLE:

1. **Lifelong Learning** — the ecosystem supports learning from first degree to
   late career and treats every stage as equally valid.
2. **Research Capacity Development** — research methodology, writing, ethics,
   and impact are first-class learning domains, not electives.
3. **Competency-Based Education** — all learning, assessment, and certification
   is expressed through an explicit competency framework.
4. **Open Knowledge Sharing** — learning objects reference canonical open
   scholarship and are themselves shareable under learner consent.
5. **Personalised Learning** — pathways, pacing, and support adapt to the
   learner's evidence, goals, and context.
6. **AI-Augmented Learning** — AI assistants support the learner, the mentor,
   and the institution under governance.
7. **Evidence-Based Assessment** — every judgement is anchored to documented
   evidence and transparent rubrics.
8. **Mentorship & Scholarly Communities** — learning is a social act;
   mentorship and community surfaces are first-class learning infrastructure.
9. **Professional Development** — continuing professional development (CPD) is
   a designed output, recorded and portable.
10. **Interoperability** — the SLE interoperates with the entire Scholatia
    ecosystem; it never duplicates what other modules own.

---

# Chapter 2 — System Goals

## 2.1 System Goals

The SLE itself must be:

- **Correct by construction** — derived aggregates, canonical references, and
  append-only audit, consistent with the platform's module conventions.
- **Non-duplicating** — the SLE references canonical researchers, publications,
  institutions, groups, and communities; it does not copy them.
- **Reliable at scale** — designed for global higher education volume; all
  statistics are derived from the typed learning graph.
- **Secure and private** — learning records are governed by explicit consent,
  privacy, and permissions models (Chapter 15).
- **Verifiable** — every credential and learning record can be independently
  verified through the platform's Trust and Verification surfaces.

## 2.2 Educational Goals

- Develop research capacity across all disciplines and career stages.
- Provide structured formal learning (programmes, curricula, courses) with
  recognised outcomes.
- Support informal and non-formal learning wherever scholarship happens.
- Promote competency-based progression with transparent evidence.
- Make learning accessible, inclusive, and adapted to the learner.

## 2.3 Research Goals

- Teach every stage of the Research Lifecycle as a learnable, assessable
  competency.
- Raise methodological, statistical, and ethical standards of research.
- Reduce the learning cost of publishing, funding, and impact.
- Connect learners to live research practice through communities, labs, and
  mentorship.

## 2.4 Professional Goals

- Support continuing professional development and CPD record-keeping.
- Build teaching, leadership, digital, and professional skills.
- Enable career development through skill profiles and credentials.
- Bridge academic and professional pathways (industry mentorship, publishing
  skills, entrepreneurship).

## 2.5 Institutional Goals

- Give institutions a governed surface to run academies, training series, and
  doctoral programmes.
- Provide institutions with aggregated, privacy-aware learning analytics.
- Support institutional QA of learning content and assessment.
- Enable inter-institutional recognition of competencies and credentials.

## 2.6 Global Goals

- Reduce the global divide in research capacity development.
- Enable cross-language, cross-discipline, cross-region learning exchange.
- Support the Global Learning Network as the ecosystem's public-good surface.
- Contribute verified, portable credentials to the global higher education
  community.

---

# Chapter 3 — Learning Model

The SLE recognises eleven learning modes. They are **modes of engagement**, not
storage structures: the same learning object can be engaged in multiple modes.

## 3.1 Formal Learning

Structured, institutionally recognised learning with defined curricula,
schedules, assessment, and credentials (programmes, courses, degrees).
**Surface:** Programme → Curriculum → Course hierarchy; Certification.

## 3.2 Informal Learning

Incidental, self-directed learning that occurs through scholarly activity —
reading, discussions, journal clubs, browsing, and practice. **Surface:**
community and discovery surfaces; captured only with learner consent.

## 3.3 Non-formal Learning

Structured but not institutionally credentialled — workshops, bootcamps,
masterclasses, webinars, training series. **Surface:** Events; Micro
Credentials and Badges.

## 3.4 Micro-learning

Short, focused learning objects (a topic, activity, or lesson) deliverable in
minutes, optimised for retention and mobile contexts. **Surface:** Lessons,
Topics, Activities; Micro Courses.

## 3.5 Project-based Learning

Learning by producing a real artefact — a dataset, a study protocol, a
manuscript, a grant proposal. **Surface:** Activities; Workflow/Research
Projects integration; the produced artefact is the assessment evidence.

## 3.6 Research-based Learning

Learning embedded in performing research — methodology taught against a live
project, with the research record as the learning record. **Surface:** Research
Learning (Chapter 6); Research Projects and the Research Lifecycle.

## 3.7 Collaborative Learning

Learning through joint activity — group tasks, shared projects, co-authored
artefacts. **Surface:** Groups, Research Teams, Laboratories, Collaboration
Workspaces.

## 3.8 Peer Learning

Learning from and with peers — peer assessment, peer review, study groups,
reading circles. **Surface:** Peer Assessment; Forums; Journal Clubs; Reading
Circles.

## 3.9 Mentor-guided Learning

Learning under the guidance of a supervisor, mentor, or coach, with structured
milestones and feedback. **Surface:** Mentorship Architecture (Chapter 10);
Supervisor Assessment.

## 3.10 AI-assisted Learning

Learning augmented by the platform's intelligence layer — coaching, feedback,
recommendations, adaptive pacing. **Surface:** AI Integration (Chapter 13);
CRIE.

## 3.11 Lifelong Learning

A continuous, career-spanning engagement model — learning objects, credentials,
and records persist and accumulate across the learner's entire life.
**Surface:** Learning Passport; CPD Records; Competency Transcript.

---

# Chapter 4 — Learning Object Hierarchy

The SLE organises learning through a single typed hierarchy. Every node in the
hierarchy is a **learning object** with a stable identity, a canonical owner,
metadata, and optional evidence.

```
Programme
  ↓
Curriculum
  ↓
Learning Path
  ↓
Course
  ↓
Module
  ↓
Lesson
  ↓
Topic
  ↓
Activity
  ↓
Assessment
  ↓
Reflection
  ↓
Competency
  ↓
Certification
```

## 4.1 Node definitions

| Node | Definition | Granularity | Example |
|---|---|---|---|
| **Programme** | A top-level educational offering with a qualification intent and one or more curricula. | Years | Doctoral Programme in Public Health |
| **Curriculum** | A coherent body of learning under a programme; the structural spine of courses. | Semesters | Core Methodology Curriculum |
| **Learning Path** | A personalised, traversable sequence of courses/modules/topics assembled for a learner or role. | Variable | Machine Learning for Social Scientists |
| **Course** | A self-contained teaching unit with defined learning outcomes and assessment. | Weeks | Advanced Biostatistics |
| **Module** | A unit within a course (or path) with a focused outcome. | Weeks/days | Survival Analysis |
| **Lesson** | A single teaching session or object. | Hours/minutes | Cox Regression Concepts |
| **Topic** | A concept unit within a lesson. | Minutes | Censoring and Truncation |
| **Activity** | An exercise the learner performs; the primary evidence-producing node. | Minutes | Compute a hazard ratio |
| **Assessment** | A measured evaluation against criteria (Chapter 7). | Episodic | Formative quiz on regression diagnostics |
| **Reflection** | A structured learner reflection; feeds self-regulation and adaptive learning. | Episodic | What did this reveal about my analysis? |
| **Competency** | A demonstrable capability evidenced by activities/assessments (Chapter 8). | Cumulative | Perform survival analysis correctly |
| **Certification** | A verifiable credential issued on competency evidence (Chapter 9). | Cumulative | Micro Credential in Survival Analysis |

## 4.2 Hierarchy rules

1. **Typed DAG, not a strict tree** — the canonical spine is top-down, but a
   Learning Path may traverse any combination of courses, modules, lessons, and
   topics from different curricula; a Topic may serve multiple Lessons.
2. **Parent–child ownership** — each node (except the spine roots) declares a
   canonical parent of the type above it; aggregates are derived upward and
   never hand-maintained.
3. **Assessment links competencies** — an Assessment references one or more
   Competencies; learner results update those competencies, never a hand-edited
   transcript.
4. **Reflection loops back** — Reflections attach to activities/assessments and
   are inputs to adaptive learning and the learner's portfolio, not decorative
   fields.
5. **Certification terminates evidence chains** — a Certification is issued only
   when the referenced competencies have sufficient assessed evidence.
6. **Every node is versionable** — content changes version without destroying
   historical learner evidence (Chapter 15).
7. **Every node is knowledge-graph-ready** — each node carries stable identity
   and typed relationships (prerequisite, outcome, assessment, competency) so
   the ecosystem Knowledge Graph can reason over the learning domain.

---

# Chapter 5 — Learning Components

Learning Components are reusable content families. Each component is
implemented as an aggregate of hierarchy nodes (courses, modules, topics,
activities) with defined competency outcomes. All components follow the SLE
conventions: derived analytics, canonical references, and governance by
permissions and quality assurance.

| Component | Purpose | Primary Competency Domains | Typical Delivery |
|---|---|---|---|
| **Courses** | Structured teaching units with outcomes, materials, and assessment. | All domains | Formal, self-paced, blended |
| **Micro Courses** | Short, focused courses (hours/days) for targeted skills. | Research, Digital, Professional | Micro-learning, non-formal |
| **Reading Lists** | Curated collections of canonical publications for a topic or path. | Knowledge, Research | Informal, mentor-guided |
| **Learning Playlists** | Ordered selections of learning objects and resources for a goal. | Knowledge, Professional | Self-directed, personalised |
| **Research Methodology** | Design, methods, and analytical approaches. | Research Competencies | Research Learning (Ch. 6) |
| **Statistics** | Statistical reasoning and data analysis skills. | Research, Digital | Courses, micro-learning |
| **Academic Writing** | Scholarly writing craft — clarity, structure, argument. | Research, Writing | Workshops, project-based |
| **Literature Review** | Systematic search, appraisal, and synthesis of literature. | Research | Research-based learning |
| **Referencing** | Citation practice, bibliographic standards, and integrity. | Research, Digital | Micro-learning, activities |
| **Publishing Skills** | Manuscript preparation, submission, peer review, and open access. | Research, Professional | Courses, mentorship |
| **Grant Writing** | Proposal development and funding strategy. | Research, Entrepreneurship | Project-based, workshops |
| **Research Ethics** | Ethical conduct, integrity, consent, and compliance. | Professional, Ethics | Formal, assessment-heavy |
| **Innovation** | Ideation, creative problem-solving, and knowledge transfer. | Innovation | Project-based |
| **Entrepreneurship** | Commercialisation, venture creation, and market skills. | Entrepreneurship | Project-based, mentorship |
| **Teaching Skills** | Pedagogy, curriculum design, and assessment design. | Teaching | Formal, reflective |
| **Leadership** | Leading teams, institutions, and scholarly initiatives. | Leadership | Non-formal, mentorship |
| **Digital Skills** | Computational, data, and tool fluency. | Digital | Micro-learning, project-based |
| **Professional Skills** | Communication, collaboration, and career practice. | Professional | Non-formal, CPD |
| **Career Development** | Career planning, portfolios, and professional identity. | Professional | Mentorship, self-directed |

## 5.1 Component contract

Every Learning Component must declare:

- **Owner and audience** — who curates it and who it is for.
- **Outcome competencies** — which competencies it develops (Chapter 8).
- **Content graph** — the hierarchy nodes it aggregates.
- **Assessment plan** — which assessment types apply (Chapter 7).
- **Credential hooks** — whether completion may trigger badges, micro
  credentials, or certificates (Chapter 9).

---

# Chapter 6 — Research Learning

Research Learning is the educational shadow of the Research Lifecycle. Every
stage of the lifecycle has a corresponding learning unit, so a scholar can
learn a stage **before** and **while** performing it. Research Learning units
map 1:1 onto the canonical lifecycle stages (idea → knowledge-transfer) and
assess against Research Competencies.

| Research Learning Unit | Lifecycle Stage | Core Outcomes | Assessment Anchor |
|---|---|---|---|
| **Research Design** | Idea / Concept Note | Framing a testable research question | Design critique; rubric |
| **Research Process** | Concept Note → Proposal | Executing the full research cycle | Portfolio of process artefacts |
| **Research Planning** | Proposal | Scoping, budgeting, scheduling | Project plan artefact |
| **Proposal Development** | Proposal | Writing a fundable, ethical proposal | Proposal reviewed by supervisor/peer |
| **Methodology** | Methodology | Selecting and justifying methods | Methodology chapter/artefact |
| **Sampling** | Methodology | Sampling design and rationale | Sampling plan artefact |
| **Instrument Design** | Dataset | Designing valid instruments | Instrument + pilot report |
| **Data Collection** | Dataset | Collecting and managing data | Data collection log |
| **Data Analysis** | Analysis | Analysing data appropriately | Analysis report; statistics assessment |
| **Interpretation** | Interpretation | Interpreting within limitations | Interpretation write-up |
| **Discussion** | Discussion | Discussing findings against literature | Discussion chapter |
| **Recommendations** | Recommendations | Formulating actionable recommendations | Recommendation memo |
| **Publication** | Submission / Peer Review / Publication | Preparing and navigating publication | Manuscript + review responses |
| **Research Impact** | Citation / Impact / Knowledge Transfer | Articulating and evidencing impact | Impact narrative |

## 6.1 Research Learning invariants

- Research Learning units **reference** the learner's own research records
  (projects, datasets, manuscripts) as evidence — the learner's real research
  is the curriculum.
- Assessment of research learning is anchored to **artefacts** produced in the
  workflow surface, not to recall alone.
- Research Learning supports both **formal** (supervised theses) and
  **non-formal** (methodology bootcamps) engagement.

---

# Chapter 7 — Assessment Architecture

Assessment is the evidence engine of the SLE. All assessment types produce
**evidence records** that feed the Competency Framework (Chapter 8) and,
ultimately, Certification (Chapter 9). No assessment outcome is ever accepted
without an evidence anchor and an audit trail.

| Assessment Type | Purpose | Timing | Primary Evidence | AI Role |
|---|---|---|---|---|
| **Diagnostic** | Establish prior competence before learning. | Pre-course / pre-path | Baseline tasks, self-report | Gap detection (Ch. 13) |
| **Formative** | Guide learning while it happens. | Continuous | Quizzes, activities, feedback | Real-time feedback, hints |
| **Summative** | Judge achievement at a point. | End of module/course/path | Exam, project, artefact | Scoring support under rubric |
| **Peer Assessment** | Shared judgement among peers. | Collaborative phases | Peer reviews, calibrations | Calibration, anonymisation |
| **Supervisor Assessment** | Judgement by mentor/supervisor. | Milestones, mentored learning | Supervisor reports, rubrics | Evidence summarisation |
| **AI Feedback** | Machine-generated feedback to the learner. | Formative loops | Model outputs, derived signals | Feedback generation under governance |
| **Rubrics** | Transparent criterion-based scoring. | All graded types | Criterion scores | Rubric administration, calibration |
| **Competency Evaluation** | Mapping evidence to competencies. | Ongoing, cumulative | All prior evidence | Evidence-to-competency mapping |
| **Research Portfolio Assessment** | Holistic judgement of a portfolio. | Programmatic, end-of-programme | Portfolio of artefacts + reflections | Portfolio analysis, gap spotting |

## 7.1 Assessment invariants

1. **Rubrics first** — any graded assessment references a rubric with explicit
   criteria and levels; unrubricised grades are not accepted for certification.
2. **Evidence is immutable** — assessment evidence is append-only and
   versioned; corrections create new records, never overwrites.
3. **AI is assistive** — AI feedback is labelled as AI-generated, is governed
   by the AI protocol, and never substitutes for human academic judgement in
   formal credential decisions.
4. **Fair and accessible** — assessment is designed for accessibility and
   equity; accommodations are first-class, not exceptions.
5. **Integrity is designed in** — plagiarism, collusion, and impersonation
   controls reference the platform's integrity and trust surfaces.

---

# Chapter 8 — Competency Framework

The Competency Framework is the **unifying semantic layer** of the SLE: it is
what activities evidence, what assessments measure, what mentors develop, and
what certifications certify.

## 8.1 Knowledge, Skills, and Competencies

- **Knowledge** — what a learner understands (declarative).
- **Skills** — what a learner can do (procedural, observable).
- **Competencies** — integrated knowledge + skill + judgement applied in
  context, demonstrable and assessable.

A competency is the unit of currency; knowledge and skills are its inputs.

## 8.2 Competency domains

| Domain | Description |
|---|---|
| **Knowledge** | Foundational disciplinary and domain understanding. |
| **Skills** | Applied abilities across research, writing, data, and tools. |
| **Research Competencies** | Design, methodology, analysis, interpretation, publication, impact. |
| **Digital Competencies** | Computational, data, and tool fluency. |
| **Teaching Competencies** | Pedagogy, curriculum, assessment design, supervision. |
| **Leadership Competencies** | Team, institutional, and scholarly leadership. |
| **Innovation Competencies** | Ideation, problem-solving, knowledge transfer. |
| **Entrepreneurship Competencies** | Opportunity recognition, venturing, commercialisation. |
| **Professional Competencies** | Communication, collaboration, ethics, career practice. |

## 8.3 Progression levels

Every competency is assessed on a five-level progression:

| Level | Name | Meaning |
|---|---|---|
| **L1** | Foundational | Aware of the competency; can describe it with guidance. |
| **L2** | Developing | Can apply it in simple, structured contexts. |
| **L3** | Proficient | Can apply it independently in real contexts. |
| **L4** | Advanced | Can apply it to complex, ambiguous problems. |
| **L5** | Expert | Can lead, teach, and extend the competency. |

Progression is **evidence-driven**: a learner advances a competency level when
assessed evidence meets the rubric threshold — never by seat time or
self-declaration alone.

## 8.4 Competency model

- Competencies are **stable, versionable entities** with identity, description,
  domain, levels, and prerequisite relationships.
- Competency records are **derived** from evidence; the platform never stores a
  hand-edited competency score that contradicts the evidence log.
- The framework is **knowledge-graph-ready**: competency nodes relate to
  learning objects, assessment outcomes, mentor endorsements, and credentials.

---

# Chapter 9 — Certification Architecture

Certification is the trust-bearing output of the SLE. Every credential is an
immutable, verifiable statement that a learner demonstrated specified
competencies. Credentials interoperate with the platform's Identity, Trust, and
Verification surfaces; each credential carries a permanent verification
reference so any third party can confirm its validity.

| Artifact | Granularity | Issuer | Evidence Anchor | Verification |
|---|---|---|---|---|
| **Certificate** | Course/path completion | Institution or platform | Passed assessments + rubric | Permanent verification reference |
| **Micro Credential** | Focused competency cluster | Institution, community, or platform | Competency evidence stack | Verifiable, portable |
| **Digital Badge** | Single competency or achievement | Any authorised issuer | Specific evidence record | Machine-verifiable badge metadata |
| **Professional Badge** | Professional competency | Accrediting body | Professional evidence + CPD | Tied to CPD record |
| **Research Badge** | Research competency | Platform/institution | Research artefact + assessment | Tied to research record |
| **Academic Award** | Programme/curriculum achievement | Institution | Programme evidence portfolio | Institutional authority |
| **Competency Transcript** | Cumulative competency record | Platform | Full evidence log | Living, always current |
| **CPD Records** | Continuing professional development | Learner + issuer | Activity + reflection evidence | Portable, auditable |
| **Learning Passport** | Lifetime learning + credential record | Platform (learner-owned) | Aggregation of all above | Learner-controlled sharing |

## 9.1 Certification invariants

1. **Evidence before issuance** — no credential issues without the evidence
   chain satisfying the referenced competencies.
2. **Issuer authority** — every credential declares an issuing authority whose
   authority is verified through the platform's Trust surface.
3. **Portability** — credentials are structured for export and external
   verification; the Learning Passport is the learner-owned aggregation point.
4. **Revocation and renewal** — credentials support governed revocation and
   expiry, each with an audit trail.
5. **AI-neutrality** — AI never issues credentials; it only summarises evidence
   for human authorities.

---

# Chapter 10 — Mentorship Architecture

Mentorship is a first-class learning infrastructure. The SLE supports eight
mentor roles, a governed matching layer, and a structured mentoring lifecycle,
interoperating with existing community mentorship surfaces.

## 10.1 Mentor roles

| Role | Focus | Typical Source |
|---|---|---|
| **Supervisor** | Academic direction and formal research oversight. | Institution, formal assignment |
| **Mentor** | Holistic scholarly development over time. | Community, programme |
| **Coach** | Skill-specific, goal-focused development. | Community, professional body |
| **Peer Mentor** | Reciprocal learning among peers. | Peers, cohort |
| **Industry Mentor** | Professional/industry perspective. | Industry, professional networks |
| **Institutional Mentor** | Institution-specific navigation and policy. | Institution |
| **Research Mentor** | Research craft and methodology development. | Research teams, labs |
| **Community Mentor** | Community culture, norms, and subject expertise. | Communities |

## 10.2 Matching algorithms

Mentor–learner matching reuses the platform's derived intelligence signals
(SADR-006: intelligence is derived, never owned) and refines them for
mentorship:

- **Goal matching** — learner goals and target competencies versus mentor
  expertise and evidence.
- **Skill complementarity** — mentor strengths against learner gaps.
- **Context affinity** — discipline, career stage, community, and language
  alignment.
- **Capacity and commitment** — mentor availability and load (derived from
  mentorship records).
- **Ethics and trust** — conflicts of interest, authority, and trust scores are
  surfaced; never hidden.

Matches are **recommendations**, not assignments; both parties consent.

## 10.3 Mentoring lifecycle

```
Request → Match → Agree → Engage → Assess → Reflect → Review → Close
```

| Phase | Description |
|---|---|
| **Request** | Learner/mentor expresses intent; goals captured. |
| **Match** | Derived matching recommends pairings; consent obtained. |
| **Agree** | Both parties agree scope, cadence, and confidentiality. |
| **Engage** | Structured sessions, milestones, and evidence collection. |
| **Assess** | Supervisor/mentor assessment against agreed competencies. |
| **Reflect** | Structured reflection captured by both parties. |
| **Review** | Periodic review of outcomes and relationship health. |
| **Close** | Governed conclusion; records retained; potential renewal. |

Mentorship records are **append-only** and reference canonical identities by
username; derived analytics (pairings, activity, outcomes) are engine-computed.

---

# Chapter 11 — Community Learning

Learning happens where scholars gather. Community Learning makes the social
surfaces of Scholatia into learning surfaces, without duplicating their
records. Each community surface references canonical community entities and
attaches SLE learning affordances.

| Community Surface | Learning Affordance | SLE Hook |
|---|---|---|
| **Groups** | Shared curriculum and cohort learning | Learning Objects attached to group workspace |
| **Communities** | Community-curated learning, mentorship | Community Learning Paths, Community Mentors |
| **Forums** | Q&A and discussion as informal learning | Discussion evidence (consented) |
| **Journal Clubs** | Critical appraisal of literature | Reading Lists, Literature Review |
| **Reading Circles** | Collaborative close reading | Reading Lists, Reflections |
| **Research Teams** | Research-based learning in teams | Project-based Learning, artefacts |
| **Laboratories** | Methodological apprenticeship | Research Learning, Research Mentors |
| **Discussion Boards** | Asynchronous knowledge exchange | Thread evidence (consented) |
| **Knowledge Exchange** | Cross-community skill sharing | Micro-learning, Peer Learning |

## 11.1 Community Learning invariants

- Learning affordances **attach to** community entities by identity; they never
  copy community records into the learning store.
- Community learning is **consent-aware** — informal participation becomes
  learning evidence only with explicit learner consent.
- Community-curated credentials are issued by the community as a verified
  issuer under the Certification Architecture (Chapter 9).

---

# Chapter 12 — Events

Events are time-boxed, synchronous learning surfaces. The SLE supports nine
event formats, each with defined structure, intensity, delivery, and credential
hooks. Events reference the platform's existing event infrastructure and
announcement surfaces; the SLE adds the learning contract.

| Event | Format | Intensity | Primary Learning Mode | Credential Hook |
|---|---|---|---|---|
| **Masterclass** | Expert-led deep session | High, short | Non-formal, AI-assisted | Professional Badge |
| **Bootcamp** | Intensive practical training | High, multi-day | Project-based, micro-learning | Micro Credential |
| **Workshop** | Hands-on skill session | Medium | Project-based, peer | Professional Badge |
| **Summer School** | Multi-day/term intensive | High, sustained | Formal + research-based | Certificate / academic credit |
| **Winter School** | Multi-day/term intensive | High, sustained | Formal + research-based | Certificate / academic credit |
| **Seminar** | Academic talk and discussion | Low/medium | Informal, formal | Attendance/CPD |
| **Webinar** | Remote presentation session | Low | Informal, non-formal | CPD record |
| **Conference** | Large multi-track gathering | Varies | Formal, informal, networking | CPD, published proceedings |
| **Training Series** | Structured sequence of sessions | Medium, sustained | Non-formal, micro-learning | Micro Credential / CPD |

## 12.1 Event invariants

- Each event declares a **learning contract**: outcomes, mode, assessment, and
  credential hooks before it runs.
- Event records are versioned and audited; attendance and completion evidence
  are captured by consent.
- Events integrate with communities, institutions, and groups as co-owners
  where relevant, referencing — never duplicating — their records.

---

# Chapter 13 — AI Integration (CRIE)

AI integration is **derived-first** and **governed**. The SLE defines an
integration surface with the orchestration intelligence layer (CRIE): CRIE may
consume learning signals and emit intelligence, but it never owns learning
records, never issues credentials, and always operates within the platform's AI
governance protocol.

## 13.1 AI capabilities

| Capability | Signal Source | CRIE Interface | Derivation |
|---|---|---|---|
| **Personal Learning Assistant** | Learning graph + learner evidence | Advisory surface | Derived + model-based |
| **Research Coach** | Research lifecycle + learner records | Coaching recommendations | Derived-first |
| **Writing Assistant** | Manuscripts/workflow artefacts | Writing guidance | Model-based, labelled |
| **Citation Assistant** | Publication graph + reading lists | Citation guidance | Derived + model |
| **Reading Assistant** | Reading lists + learner progress | Comprehension support | Model-based, labelled |
| **Research Gap Detection** | Emerging topics + learner goals | Gap recommendations | Derived (Intelligence module) |
| **Competency Analysis** | Evidence log → competency model | Competency summaries | Derived |
| **Learning Recommendations** | Learner profile + content graph | Next-best-learning | Derived-first |
| **Adaptive Learning** | Assessment + engagement signals | Pacing and scaffolding | Derived + model |
| **Knowledge Graph** | Typed learning graph | Semantic reasoning | Derived |

## 13.2 AI integration principles

1. **Derived-first (SADR-006)** — recommendations, competency summaries, and
   analytics are derived from canonical modules; models add value on top,
   never replace derivation.
2. **Human-in-the-loop** — AI feedback is advisory; formal assessment and
   credential decisions remain human.
3. **Transparent and labelled** — AI output is identified as AI-generated with
   stated confidence.
4. **Privacy-respecting** — AI operates on consented evidence; models never
   receive learner data outside the platform's privacy and ethics rules.
5. **CRIE-ready by contract** — every capability exposes a stable input/output
   contract so CRIE can orchestrate learning workflows without coupling to
   storage or models.

---

# Chapter 14 — Cross-Module Integration

The SLE is a citizen of the whole ecosystem. It integrates with every other
module by **reference and event**, never by duplication.

| Module | Integration Points | Data Flow |
|---|---|---|
| **Identity** | Learners are canonical researcher identities (username/SAID) | Learning records reference learners; never copies |
| **Trust** | Issuer and mentor authority; verification of credentials | Credentials consumed by Trust for verification |
| **Verification** | Permanent verification references on credentials | Verification surface validates credentials |
| **Publishing** | Publication skills learning; writing feedback on manuscripts | Learning references publications; evidence feeds portfolios |
| **Conferences** | Conference learning events; conference badges | Events reference conference entities |
| **Journals** | Publishing skills, journal clubs, review practice | Reading lists reference journals |
| **Marketplace** | Paid courses, academies, and services | Commerce completes learning transactions |
| **Groups** | Cohort learning and shared curricula | Learning attaches to group entities |
| **Communities** | Community learning and mentorship | Learning attaches to community entities |
| **Messaging** | Mentor-learner conversation and alerts | Mentorship session coordination |
| **Notifications** | Milestones, assessment results, event reminders | Learning emits notification events |
| **Activity** | Learning actions in the platform event stream | Learning emits activity events |
| **Workflow (SWTROP)** | Artefacts, tasks, reviews for project-based learning | Workflow executes learning tasks; artefacts are evidence |
| **Research Projects** | Research-based learning on live projects | Projects provide real learning context and evidence |
| **Research Intelligence** | Trends, gaps, expertise matches | Intelligence feeds recommendations and research learning |
| **Knowledge Graph** | Typed learning graph connected to the ecosystem | Learning nodes/edges join the knowledge graph |
| **Digital Twins** | Personalised, persistent learning state | Digital Twin consumes consented learning signals (Phase 5) |

## 14.1 Integration invariants

- **Reference over copy** — every cross-module relationship is an identity
  reference; no module's canonical record is duplicated in the learning store.
- **Event-based coupling** — modules communicate through the platform's
  Activity/Notifications/Workflow surfaces; no hidden direct coupling.
- **Derived analytics** — any aggregate spanning modules is computed, never
  hand-maintained.
- **Consent boundaries** — personalisation across modules follows the privacy
  and consent model of Chapter 15.

---

# Chapter 15 — Governance

The SLE is governed end-to-end. Every policy below has an explicit mechanism
and audit trail.

| Topic | Policy | Mechanism |
|---|---|---|
| **Permissions** | Role-based access to learning objects, records, and admin functions. | Extends platform RBAC; role per node and per surface. |
| **Moderation** | Learning content and community learning are moderated. | Content review, flags, appeals, and suspension. |
| **Privacy** | Learning records are learner-owned and consent-governed. | Consent model, data minimisation, access controls, export/delete. |
| **Academic Integrity** | Plagiarism, collusion, impersonation, and fabrication are prevented. | Integrity checks, evidence immutability, audit. |
| **Ethics** | Learning respects learner welfare, fairness, and AI governance. | AI protocol, research ethics integration, review. |
| **Accessibility** | Learning is accessible across ability, language, and context. | WCAG-aligned design, alternative formats, accommodations. |
| **Quality Assurance** | Content and assessment meet quality standards. | Issuer QA workflow, rubrics, course review, version control. |
| **Audit Trails** | All significant learning events are recorded. | Append-only audit log per node and learner. |
| **Versioning** | Content and credentials version without destroying evidence. | Versioned entities; evidence always links to a specific version. |

## 15.1 Governance invariants

- **Learner ownership** — the learner is the owner of their learning record;
  institutions and issuers hold authority over what they issue, not over the
  learner's history.
- **Appeal and redress** — every assessment, moderation, and revocation
  decision has an appeal path.
- **Audit completeness** — issuance, revocation, moderation, and consent
  changes are audited; nothing is silently edited.

---

# Chapter 16 — Future Expansion

The SLE is designed to grow without re-architecture. The following capabilities
are reserved expansion targets; each will be specified by its own functional
specification and implemented as an additive module under this architecture.

| Expansion | Description | Dependencies |
|---|---|---|
| **Virtual Research School** | A platform-wide school for research capacity development. | Research Learning, Certification |
| **Doctoral Academy** | Structured doctoral training, supervision, and portfolio assessment. | Mentorship, Workflow, Institutions |
| **Professional Academy** | Professional development and CPD academies. | Professional Competencies, CPD Records |
| **Institutional Academy** | Institution-branded academies under institutional governance. | Institutions, RBAC, QA |
| **Global Learning Network** | Public-good cross-institution learning exchange. | Global goals, interoperability, portability |
| **AI Tutor** | Personalised, adaptive AI tutoring. | AI Integration, Adaptive Learning |
| **Immersive Learning** | Immersive environments for learning and practice. | Technology-neutral interface layer |
| **Simulation** | Simulated research and professional scenarios. | Assessment, Research Learning |
| **Digital Twin Learning** | Persistent, personalised learning state via the research Digital Twin. | Digital Twins (Phase 5), Knowledge Graph |
| **Research Intelligence Integration** | Deeper learning↔intelligence coupling (trend-driven curricula). | Research Intelligence, CRIE |

## 16.1 Expansion invariants

- Each expansion is **additive**: it composes existing chapters, never forks
  them.
- Each expansion preserves the constitutional invariants: reference over copy,
  derived analytics, consent-governed privacy, human authority in credentials,
  and CRIE-ready contracts.
- No expansion is realised before its functional specification is approved.

---

# Chapter 17 — Learning Analytics Architecture

Learning analytics is the **derived evidence surface** of the SLE. It observes
the learning graph — the hierarchy nodes (Chapter 4), assessments and rubrics
(Chapter 7), the competency model (Chapter 8), mentorship records (Chapter 10),
community participation (Chapter 11), events (Chapter 12), and workflow
artefacts (Chapter 14) — and computes indicators of learning health at every
scale, from a single learner to the global ecosystem.

Consistent with SADR-006, analytics are **derived and never owned**: no
hand-maintained score, completion count, or ranking is stored; every indicator
is computed on demand from the typed evidence graph. Analytics respect the
privacy and consent model of Chapter 15 and are emitted for AI consumption
(Chapter 13) and interoperability (Chapter 22) through stable contracts.

## 17.1 Analytics domains

| Analytics Surface | Level | Primary Questions | Primary Evidence Sources |
|---|---|---|---|
| **Learning Progress Analytics** | Learner | Is the learner advancing through the hierarchy? | Chapter 4 traversal, activities, milestones |
| **Learning Behaviour Analytics** | Learner | How does the learner study? | Session and interaction records (consented) |
| **Learning Engagement Analytics** | Learner / cohort | How involved is the learner? | Activity events, community participation (Chapter 11) |
| **Knowledge Acquisition Analytics** | Learner | Is declarative knowledge growing? | Knowledge assessments, reading evidence (Chapters 5, 7) |
| **Skill Acquisition Analytics** | Learner | Are skills demonstrable? | Performance tasks, artefacts, rubrics (Chapter 7) |
| **Competency Growth Analytics** | Learner | Are competencies progressing L1–L5? | Evidence-to-competency mapping (Chapter 8) |
| **Learning Velocity** | Learner / path | How fast is competence gained per unit time? | Derived rate over competency evidence |
| **Retention Analytics** | Learner / course | Is learning retained over time? | Repeated and spaced assessments, re-engagement |
| **Completion Analytics** | Course / path | Who completes what, and at what quality? | Progress and certification events (Chapter 9) |
| **Drop-off Prediction** | Course / path | Where will learners stall or leave? | Derived prediction from behaviour and risk signals |
| **Learning Risk Detection** | Learner | Who is at risk, and why? | Velocity, engagement, assessment, intervention history |
| **Personalised Intervention** | Learner | What action helps this learner now? | Chapter 13 recommendations; mentor alerts (Chapter 10) |
| **Supervisor Analytics** | Mentor–mentee | How is the mentee progressing? | Mentorship records and learner evidence (Chapter 10) |
| **Faculty Analytics** | Instructor | Are courses achieving their outcomes? | Course completion and assessment statistics |
| **Institution Analytics** | Institution | How healthy is institutional learning? | Roll-up to institution (Chapter 21) |
| **National Analytics** | National | How is national research capacity developing? | Aggregated, anonymised roll-up |
| **Global Analytics** | Global | How healthy is the global learning ecosystem? | Aggregated, anonymised roll-up (Chapter 22) |

## 17.2 Data flow

The analytics pipeline is a typed, consent-gated flow:

1. **Emit** — learning events (activity, assessment, reflection, completion,
   mentorship, event attendance) are emitted through the platform's Activity
   surface (Chapter 14) as append-only records.
2. **Collect** — consented records are normalised into a canonical evidence
   form; nothing is collected without consent (Chapter 15).
3. **Resolve** — every record resolves to a canonical identity (username/SAID)
   and to canonical content and competency identities; no duplicated copies.
4. **Filter** — a consent and role filter applies at every aggregation
   boundary; individual data never crosses a boundary without authorisation.
5. **Aggregate** — indicators are aggregated by the typed roll-up hierarchy
   (learner → supervisor → cohort → faculty → institution → national →
   global).
6. **Derive** — analytics are computed on demand from the aggregate evidence
   graph; nothing is stored as a hand-maintained count.
7. **Render** — results are rendered into role-appropriate dashboards and
   reports (17.6, 17.7).
8. **Consume** — derived signals are exposed to AI (Chapter 13), the Knowledge
   Graph (17.10), and external interoperability (Chapter 22).

## 17.3 Privacy

Privacy is a structural property, not an afterthought:

| Tier | Visible Data | Who May See |
|---|---|---|
| Individual | Full learner evidence | The learner alone, plus authorised supervisors (Chapter 10) |
| Cohort | Pseudonymised group indicators | Faculty and course owners |
| Institution | Aggregate indicators and authorised individual records | Institution governance (Chapter 21) |
| National | Aggregate-only, cell-suppressed | Authorised national bodies |
| Global | Aggregate-only, cell-suppressed | Authorised global operators |

- Learners own their records (Chapter 15); analytics surfaces expose only what
  consent and role permit.
- Above the cohort tier, indicators are **cell-suppressed** (no groups below a
  minimum size) and **pseudonymised** so no individual is identifiable.
- All analytics access is **audited**; report generation is versioned against
  the content versions it describes (Chapter 15).

## 17.4 Aggregation

- Aggregation is a **typed roll-up** over the canonical identity hierarchy;
  there is no separate aggregate store whose numbers can drift from evidence.
- Aggregates are **derived on demand**; cached forms are explicitly
  time-stamped and refreshable, never authoritative hand-maintained values.
- Aggregation is **version-aware**: learner evidence always references the
  content and rubric versions in force when it was produced (Chapters 4, 15).
- Global and national roll-ups apply **minimum-cell thresholds** and
  statistical disclosure control before publication.

## 17.5 Reporting

- Reports are **role-scoped**: a learner sees their own report, a supervisor
  their mentees, a faculty their courses, an institution its academy, and so
  on up the roll-up.
- Reporting supports **scheduled and on-demand** generation; every report cites
  the evidence it summarises (traceable back to records).
- Exports follow the interoperability architecture (Chapter 22) and always
  respect the consent scope of the requesting role.

## 17.6 Dashboards

Dashboards are the primary rendered surface of learning analytics:

- **Learner dashboard** — progress, velocity, competency growth, risk, and
  interventions (Chapters 8, 17).
- **Supervisor dashboard** — mentee cohort progress and risk alerts
  (Chapter 10).
- **Faculty dashboard** — course outcomes, completion, retention
  (Chapter 5).
- **Institution dashboard** — institutional learning health and governance
  (Chapter 21).
- **National and Global dashboards** — aggregate ecosystem indicators, with
  cell suppression (17.3).

Dashboards are composed of KPI cards (17.7), derived analytics panels, and
drill-through links into the evidence that produced each indicator.

## 17.7 KPIs

Technology-neutral key performance indicators, computed from evidence:

| KPI | Definition | Source Chapters |
|---|---|---|
| **Progress rate** | % of target hierarchy nodes evidenced | 4 |
| **Completion rate** | % of learners completing within plan | 4, 12 |
| **Retention rate** | Evidence of retained competence over time | 7, 8 |
| **Engagement index** | Consented activity intensity relative to plan | 11, 14 |
| **Learning velocity** | Competency level gain per standard time unit | 8, 17 |
| **Competency attainment** | % of target competencies at or above target level | 8 |
| **Drop-off risk** | Probability of stall or exit in a window | 7, 17 |
| **Intervention coverage** | % of at-risk learners with active intervention | 10, 13 |

## 17.8 Evidence sources

Analytics draw exclusively from canonical evidence: hierarchy nodes and
activity (Chapter 4), assessments and rubrics (Chapter 7), competency evidence
(Chapter 8), certification events (Chapter 9), mentorship records (Chapter 10),
consented community participation (Chapter 11), events (Chapter 12), workflow
artefacts and project records (Chapter 14), and reflections. Any indicator that
cannot be traced to such evidence is not published.

## 17.9 AI readiness

- All analytics surfaces expose **stable, typed contracts** so AI capabilities
  (Chapter 13) and CRIE can consume learning signals without coupling to
  storage.
- Model-based additions (risk models, drop-off prediction, natural-language
  summaries) are **labelled** and operate **on top of** derived signals, never
  replacing the evidence base (SADR-006).
- Analytics outputs feed the **adaptive engine** (Chapter 18) and the
  **portfolio** (Chapter 19) through the same derived contracts.

## 17.10 Knowledge Graph readiness

- Learning analytics reference typed nodes and edges of the learning graph;
  raw event dumps never enter the graph, only derived typed relationships
  (learner → competency, learner → learning object, content → prerequisite).
- Aggregated indicators may be attached as derived properties on typed nodes,
  enabling ecosystem-wide reasoning (Chapters 14, 22).

---

# Chapter 18 — Adaptive Learning Architecture

The Adaptive Learning Engine is the **personalisation surface** of the SLE. It
continuously re-plans the learner's experience — sequence, pacing, content,
assessment, reading, research training, career development, and CPD — from the
learner's evidence (Chapters 4, 7, 8) and goals. It is **derived-first**
(SADR-006), **consent-governed** (Chapter 15), **CRIE-ready** (Chapter 13), and
**explainable**: every adaptation cites the evidence and rule that produced it.

## 18.1 Adaptive capabilities

| Capability | Input Signal | Adaptive Output |
|---|---|---|
| **Adaptive Learning Paths** | Goals, competencies, evidence (Chapters 4, 8) | A personal, traversable path |
| **Dynamic Sequencing** | Assessment and engagement signals (Chapter 7) | Reordered content sequence |
| **Prerequisite Mapping** | Typed prerequisite relationships | Guarded progression rules |
| **Learning Dependency Graph** | Content and competency graph | The engine's reasoning substrate |
| **Personalised Recommendations** | Learner profile and content graph (Chapter 13) | Next-best-learning suggestions |
| **Knowledge Gap Detection** | Diagnostic assessment (Chapter 7) | Knowledge gap set |
| **Competency Gap Detection** | Competency model vs evidence (Chapter 8) | Competency gap set |
| **Adaptive Assessments** | Ongoing evidence (Chapter 7) | Difficulty and scope tuned to evidence |
| **Adaptive Reading Lists** | Level and interests (Chapters 5, 11) | Re-ranked reading lists |
| **Adaptive Research Training** | Learner's live research (Chapter 6) | Research learning sequenced to the project |
| **Adaptive Career Development** | Career goals and skills (Chapter 5) | Career-relevant pathway adjustments |
| **Adaptive CPD** | Role and professional evidence (Chapters 8, 9) | Personal CPD plan |
| **AI-guided Learning** | AI assistants (Chapter 13) | Coaching, feedback, scaffolding |
| **CRIE-guided Learning** | CRIE orchestration (Chapter 13) | Workflow-level learning execution |
| **Knowledge Graph Integration** | Ecosystem graph (Chapters 14, 22) | Semantic traversal and inference |
| **Future Personal Learning Agent** | Digital Twin state (Phase 5) | Persistent, proactive personalisation |

## 18.2 Engine loop

```
Observe → Diagnose → Plan → Adapt → Assess → Reflect → Learn
```

1. **Observe** — evidence from learning, assessment, and behaviour is captured.
2. **Diagnose** — gaps, velocity, and risk are derived (Chapter 17).
3. **Plan** — the path, sequence, and content are re-planned from the
   dependency graph and recommendations.
4. **Adapt** — content, pacing, reading, research training, career, and CPD
   surfaces update (18.1).
5. **Assess** — adaptive assessment confirms or revises the diagnosis
   (Chapter 7).
6. **Reflect** — the learner reflects; the reflection feeds the next cycle
   (Chapter 4).
7. **Learn** — competency evidence is committed and the model refines
   (Chapters 8, 17).

## 18.3 Engine invariants

1. **Evidence-driven** — every adaptation is traceable to evidence; adaptive
   state never contradicts the evidence log.
2. **Explainable** — the learner can always ask why a change occurred and see
   the evidence and rule behind it.
3. **Fallback-safe** — the canonical hierarchy (Chapter 4) always remains
   available; adaptation never locks a learner out of the standard path.
4. **Human authority** — adaptive pacing never overrides supervisor or
   institutional decisions (Chapters 10, 21).
5. **Consent-governed** — personalisation uses only consented signals
   (Chapter 15).
6. **CRIE-ready** — the engine exposes stable contracts so CRIE can orchestrate
   adaptive workflows without owning learner state (Chapter 13).

---

# Chapter 19 — Academic Portfolio Architecture

The Academic Portfolio is the **lifelong, learner-owned evidence surface** of
the SLE. It aggregates every learning, research, professional, and community
outcome into a single derived record. Portfolios are **derived from canonical
evidence** (Chapters 4, 7, 8, 9, 10, 14) — never hand-edited summaries — and
are **shareable, verifiable, and portable** (Chapters 15, 22).

## 19.1 Portfolio surfaces

| Portfolio Surface | Contents | Primary Evidence Sources | Primary Consumers |
|---|---|---|---|
| **Academic Portfolio** | Degrees, programmes, formal learning | Chapters 4, 9 | Institutions, employers |
| **Research Portfolio** | Projects, publications, datasets, artefacts | Chapters 6, 14 | Supervisors, funders |
| **Teaching Portfolio** | Teaching, supervision, pedagogical artefacts | Chapters 5, 8, 10 | Faculty, institutions |
| **Professional Portfolio** | Professional practice, CPD, memberships | Chapters 8, 9 | Employers, professional bodies |
| **Innovation Portfolio** | Innovations, knowledge transfer, ventures | Chapters 5, 8, 14 | Funders, industry |
| **Community Portfolio** | Community roles, mentorship, service | Chapters 10, 11 | Institutions, peers |
| **Leadership Portfolio** | Leadership roles and outcomes | Chapters 8, 10 | Institutions, professional bodies |
| **Volunteer Portfolio** | Volunteering and service records | Chapter 11 | Employers, communities |
| **Awards Portfolio** | Awards, honours, academic recognition | Chapter 9 | Institutions, employers |
| **Certification Portfolio** | Certificates, micro credentials | Chapter 9 | All verifiers |
| **Competency Portfolio** | Competency levels and growth (L1–L5) | Chapter 8 | Supervisors, employers |
| **Digital Badge Portfolio** | Machine-verifiable badges | Chapters 9, 22 | All verifiers |
| **Learning Passport** | Lifetime learning and credential aggregation | Chapters 9, 19 | The learner (owner) |
| **Career Timeline** | Chronological scholarly and professional journey | Chapters 8, 14 | The learner, mentors |
| **Institutional Portfolio** | Institutional-branded aggregate view | Chapter 21 | Institutions |
| **Global Scholarly Profile Integration** | Connection to the canonical scholarly profile | Chapters 14, 22 | The ecosystem |

## 19.2 Portfolio infrastructure

- **Evidence Repository** — the append-only, versioned store of evidence
  records (Chapters 4, 15) from which every portfolio is derived.
- **Portfolio Sharing** — consent-based, role-scoped sharing; a learner
  controls who sees which surface and for how long (Chapter 15).
- **Portfolio Verification** — every included credential carries its permanent
  verification reference (Chapter 9); verifiers confirm without contacting the
  learner.
- **Portfolio Analytics** — portfolio surfaces are instrumented with the
  analytics of Chapter 17 (growth, velocity, attainment).
- **Portfolio Export** — export follows the interoperability architecture
  (Chapter 22) and preserves verification and version references.
- **Learning Passport** — the single lifelong aggregation owned by the learner
  (Chapter 9), spanning all portfolio surfaces.

## 19.3 Portfolio invariants

1. **Derived, never hand-maintained** — portfolio surfaces are computed from
   evidence; the learner curates emphasis and visibility, never the facts.
2. **Learner-owned** — the portfolio and its sharing rights belong to the
   learner (Chapter 15).
3. **Verifiable by construction** — everything displayed can be independently
   verified (Chapters 9, 22).
4. **Portable** — no surface is bound to a single institution or standard
   (Chapters 21, 22).
5. **Knowledge-graph-ready** — portfolio entries are typed nodes so the
   ecosystem graph can reason across a career (Chapters 14, 18).

---

# Chapter 20 — Research Intelligence Integration

Research Intelligence Integration defines the relationship between the Learning
Ecosystem and the research side of Scholatia. The SLE **consumes** research
intelligence to make learning relevant and **emits** learning signals so the
research surfaces can understand capacity development. The relationship is
**bidirectional, derived-first (SADR-006), and reference-based** — neither side
owns nor duplicates the other's records (Chapter 14).

## 20.1 Integration relationships

| Entity | Relationship to the Learning Ecosystem | Data Flow |
|---|---|---|
| **Learning Ecosystem** | The originating surface of this architecture | Central hub |
| **CRIE** | Orchestrates learning workflows using derived signals | Consumes analytics (17); guides learning (18) |
| **Research Writing Studio** | Writing skills practised on real artefacts | Learning references artefacts; artefacts become evidence (6, 7) |
| **Knowledge Graph** | The semantic substrate connecting learning and research | Typed nodes and edges shared (13, 14) |
| **Research Projects** | Real research context for research-based learning | Projects supply context and evidence (6, 14) |
| **Publishing** | Publishing skills and publication practice | Learning references publications (5, 14) |
| **Conferences** | Conference learning events and badges | Events reference conferences (12, 14) |
| **Journals** | Journal clubs, publishing skills, review practice | Reading lists reference journals (5, 11) |
| **Research Communities** | Community learning and mentorship | Learning attaches to communities (11) |
| **Research Groups** | Cohort learning and research training | Learning attaches to groups (11) |
| **Mentorship** | Supervisor and mentor development of capacity | Mentorship feeds and consumes evidence (10) |
| **Supervisor Workspace** | Formal oversight of learner progress | Supervisor analytics and interventions (10, 17) |
| **Reviewer Workspace** | Peer-review skill development | Review practice as evidence (7, 14) |
| **Research Intelligence Dashboard** | Derived research health indicators | Feeds curriculum and recommendations (13, 17) |
| **Research Assistant** | Derived research support | Consumes learning signals; advises (13) |
| **Writing Assistant** | Writing guidance on learner artefacts | Model-based, labelled feedback (13) |
| **Citation Assistant** | Citation guidance tied to reading lists | Citation learning and live assistance (5, 13) |
| **Literature Assistant** | Literature exploration support | Feeds literature review learning (6, 13) |
| **Gap Detection Engine** | Research gap signals | Drives research learning and recommendations (6, 13) |
| **Knowledge Discovery Engine** | Discovery across the ecosystem graph | Informs personalised learning (14, 18) |
| **Future AI Professor** | Reserved AI teaching role | Human authority preserved (16, 23) |
| **Future AI Supervisor** | Reserved AI supervision support | Human authority preserved (16, 23) |

## 20.2 Integration principles

1. **Bidirectional, non-owning** — each relationship is a typed reference plus
   event flow; neither surface duplicates the other's canonical records
   (Chapter 14).
2. **Derived signals only** — intelligence fed into learning is derived from
   canonical modules (SADR-006); model output is labelled and advisory
   (Chapter 13).
3. **Human authority** — AI roles (AI Professor, AI Supervisor) remain
   reserved and assistive; academic authority stays with humans and
   institutions (Chapters 15, 23).
4. **Consent-aware** — intelligence integration uses consented learner signals
   and never leaks learning records into research surfaces without permission
   (Chapter 15).

---

# Chapter 21 — Institutional Learning Architecture

The Institutional Learning Architecture governs how the SLE is **deployed,
branded, and governed** by the institutions of global higher education, from a
single faculty academy to a national system. Institutions are **tenants**: they
operate branded learning surfaces on shared canonical infrastructure, with
tenant-specific policy, QA, and analytics — never with duplicated core records
(Chapters 14, 15).

## 21.1 Supported institution types

| Institution Type | Primary Role | Learning Emphasis |
|---|---|---|
| **National Universities** | Degree-bearing formal education | Programmes, curricula, research learning |
| **International Universities** | Cross-border formal education | Portability, interoperability (22) |
| **Polytechnics** | Applied technical education | Project-based, skills, micro credentials |
| **Colleges of Education** | Teacher preparation | Teaching competencies, pedagogy |
| **Research Institutes** | Focused research and training | Research learning, laboratories, mentorship |
| **Professional Bodies** | Professional standards and CPD | Professional competencies, CPD records |
| **Government Agencies** | National capacity policy | National analytics, public-good learning |
| **NGOs** | Mission-driven education | Community learning, open knowledge |
| **Private Academies** | Commercial learning | Marketplace integration, branding |
| **Corporate Academies** | Workforce development | Professional skills, adaptive CPD |
| **Doctoral Schools** | Doctoral training governance | Mentorship, research learning, portfolios |
| **Graduate Schools** | Postgraduate education | Programmes, supervision, assessment |
| **Research Schools** | Research capacity academies | Research methodology, impact |
| **Faculty Academies** | Discipline faculty development | Teaching, leadership, research skills |
| **Department Academies** | Department-level training | Local curriculum, micro learning |
| **Executive Education** | Senior professional development | Leadership, professional competencies |
| **Professional Certification Centres** | Certification and examination | Certification, assessment (7, 9) |
| **Institution Analytics** | Institutional learning intelligence | Roll-up analytics (17) |

## 21.2 Institution analytics

Institutions consume the Chapter 17 roll-up at their own tier: completion,
retention, competency attainment, velocity, and risk — always privacy-aware and
cell-suppressed above the cohort tier. Institutional dashboards are governed by
institutional roles (Chapter 15) and feed institutional quality assurance.

## 21.3 Institution governance

- Institutions configure **their own policy envelope** — permissions (RBAC),
  moderation, privacy, QA, and branding — within the constitutional governance
  of Chapter 15.
- Institutional decisions (issuance, revocation, moderation, accreditation)
  are **audited** and **appealable** (Chapter 15).
- Credentials issued by institutions are verified through the platform's Trust
  and Verification surfaces (Chapters 9, 14).

## 21.4 Institution branding

- Branding is **surface-level and additive**: an institution's name, identity,
  and themes apply to its academy, dashboards, and credentials — never to the
  canonical records it references (Chapter 14).
- Branded surfaces compose the same constitutional chapters; branding never
  changes architecture, only presentation and local policy.

## 21.5 Multi-tenancy readiness

- **Tenant isolation** — learners, cohorts, and records are scoped to tenants
  by permission, never by physical duplication (Chapter 15).
- **Shared canonical spine** — identity, competency, and credential models are
  platform-wide; tenants reference them (Chapters 8, 9).
- **Tenant portability** — learners move between tenants with consent and
  carry their Learning Passport and evidence (Chapters 9, 19).
- **Cross-tenant interoperability** — tenant systems integrate through the
  standard adapters of Chapter 22.

---

# Chapter 22 — Global Interoperability Architecture

The Global Interoperability Architecture makes the SLE **open by contract**:
learner records, credentials, and learning events can move across institutions,
standards, and systems without being locked into any of them. Interoperability
is achieved through a **technology-neutral adapter layer**: canonical SLE
records (Chapters 4, 7, 8, 9) map to external standards at the boundary, and
external standards map back — the core never adopts an external format as its
storage model (Chapters 14, 15).

## 22.1 Learning interoperability standards

| Standard | Role | Integration Pattern |
|---|---|---|
| **SCORM** | Legacy packaging and sequencing of learning content | Adapter: import and export packaged courses |
| **xAPI** | Learning activity statements (learning records) | Adapter: emit and consume activity statements |
| **LTI** | External tool integration inside courses | Adapter: tool launch and grade pass-back |
| **Open Badges** | Portable, verifiable digital badges | Adapter: badge issuance and verification |
| **JSON-LD** | Linked-data serialisation for graph-ready data | Serialisation of typed nodes |

## 22.2 Scholarly identity and metadata standards

| Standard | Role | Integration Pattern |
|---|---|---|
| **ORCID** | Authoritative researcher identity | Adapter: identity mapping to canonical identity |
| **DOI** | Persistent publication identifiers | Reference: publications keep their DOIs |
| **Crossref** | Publication metadata and citation data | Adapter: metadata resolution |
| **DataCite** | Dataset metadata and DOI registration | Adapter: dataset metadata |
| **ROR** | Institutional identifiers | Adapter: institution identity mapping |
| **OpenAlex** | Open scholarly metadata and citation graph | Adapter: external research signals |
| **OpenAIRE** | Open-access scholarly infrastructure | Adapter: repository and project metadata |
| **Schema.org** | Structured data for scholarly entities | Adapter: semantic markup export |

## 22.3 Systems and infrastructure integration

| System | Role | Integration Pattern |
|---|---|---|
| **Learning Record Store (LRS)** | External store of learning activity | Adapter: xAPI statements with consent |
| **Knowledge Graph interoperability** | Cross-system semantic exchange | Adapter: JSON-LD typed graph import and export |
| **External Repository Integration** | External content and artefacts | Adapter: reference plus harvesting with consent |
| **Research Information Systems (CRIS)** | Institutional research administration | Adapter: profile and project exchange |
| **Institutional Repository Integration** | Publication and artefact deposit | Adapter: reference plus metadata sync |
| **API Federation** | Federated query across systems | Adapter: standardised API contracts |

## 22.4 Future international standards

The adapter layer is **forward-compatible**: future standards (credential
frameworks, learning records, identity systems, AI provenance standards) are
added as adapters without changing the canonical model. No future standard
forces a rewrite; each is a new boundary contract (Chapters 14, 16).

## 22.5 Interoperability invariants

1. **Canonical spine preserved** — external formats exist only at the boundary;
   the canonical SLE model is the single source of truth.
2. **Identity mapping, not copying** — external identities map to canonical
   identity; records are never duplicated across systems (Chapter 14).
3. **Consent before egress** — every outbound flow is consent-gated and
   audited (Chapter 15).
4. **Verification preserved** — credentials exported through any adapter keep
   their permanent verification reference (Chapter 9).
5. **Version tolerance** — adapters negotiate versions; a peer system on an
   older standard is never silently broken (Chapter 15).

---

# Chapter 23 — Long-Term Vision

The Long-Term Vision describes the evolution of the Scholarly Learning
Ecosystem into the **future scholarly operating surface** of global higher
education. Every capability below is **additive**: it composes the chapters of
this architecture, never re-architects them, and is realised only after its own
functional specification and implementation phase.

## 23.1 Evolution targets

| Capability | Description | Governing Chapters | Key Dependencies |
|---|---|---|---|
| **Virtual Research School** | A platform-wide school for research capacity | 6, 8, 9 | Research Learning, Certification |
| **Global Doctoral Academy** | Cross-institution doctoral training and supervision | 10, 19, 21 | Mentorship, Portfolios, Institutions |
| **Global Professional Academy** | Public-good professional and CPD education | 8, 9, 21 | Professional Competencies, CPD |
| **Research Intelligence Cloud** | Derived research intelligence as shared infrastructure | 13, 17, 20 | Analytics, CRIE, Intelligence |
| **AI Tutor** | Personalised, adaptive AI tutoring | 13, 18 | AI Integration, Adaptive Learning |
| **AI Supervisor** | Reserved AI supervision support | 13, 15, 20 | CRIE, human authority |
| **AI Examiner** | Reserved AI examination support | 7, 13, 15 | Assessment, integrity, human authority |
| **AI Research Professor** | Reserved AI teaching at research scale | 13, 16, 20 | CRIE, human authority |
| **Digital Research Twin** | Persistent personalised research and learning state | 13, 14, 18 | Digital Twins (Phase 5), Knowledge Graph |
| **Virtual Laboratories** | Remote, collaborative research practice | 6, 11, 14 | Research Learning, Collaboration |
| **Immersive Learning** | Immersive environments for learning and practice | 3, 16, 18 | Technology-neutral interface layer |
| **Simulation-based Learning** | Simulated research and professional scenarios | 3, 7, 8 | Assessment, Adaptive Learning |
| **Knowledge Graph Driven Learning** | Learning driven by the ecosystem graph | 4, 8, 18, 22 | Knowledge Graph, Interoperability |
| **Research Intelligence Driven Learning** | Trend- and gap-driven curricula | 6, 13, 20 | Research Intelligence, CRIE |
| **Global Academic Network** | The public-good learning exchange | 1, 2, 21, 22 | Institutions, Interoperability |
| **Future Scholarly Operating System** | The unified scholarly and learning surface | 1–23 | All chapters, platform-wide |

## 23.2 Evolution path

1. **Foundations** (Chapters 1–16) — the constitutional core of the SLE.
2. **Instrumentation** (Chapters 17–19) — analytics, adaptation, and the
   portfolio make the ecosystem measurable and personalised.
3. **Integration** (Chapters 20–22) — research intelligence, institutions, and
   global interoperability connect the SLE to the world.
4. **Frontier** (Chapter 23) — schools, academies, AI roles, twin-based and
   immersive learning compose into the future scholarly operating surface.

## 23.3 Long-term invariants

- Each stage is **additive and optional** — the SLE remains complete and
  coherent at every stage; no stage is a prerequisite for the constitution.
- Human authority over credential, assessment, and supervision decisions is
  preserved at every stage (Chapters 9, 15).
- AI capabilities remain **derived-first and governed** (Chapter 13);
  intelligence augments, never replaces.
- Technology neutrality is preserved — the frontier surfaces are defined by
  contracts, not by vendors or frameworks.

---

# Appendix A — Glossary

| Term | Definition |
|---|---|
| **SLE** | Scholarly Learning Ecosystem — the learning domain of Scholatia. |
| **SLEA** | The architecture of the SLE, defined by this document. |
| **Learning Object** | Any typed node of the Learning Object Hierarchy. |
| **Competency** | Integrated knowledge + skill + judgement, demonstrable and assessable. |
| **Evidence Record** | An immutable assessment/artefact/reflection record anchoring a competency claim. |
| **Credential** | A verifiable statement of demonstrated competency (Chapter 9). |
| **Learning Passport** | The learner-owned, lifetime aggregation of learning and credentials. |
| **CRIE** | The platform-wide orchestration intelligence layer (planned; consumes SWTROP). |
| **Knowledge Graph** | The cross-module semantic graph of the ecosystem (Phase 5). |
| **Research Lifecycle** | The canonical platform lifecycle (idea → knowledge-transfer). |
| **KPI** | Key Performance Indicator — a derived learning health metric (Chapter 17). |
| **Adapter Layer** | The boundary mapping canonical SLE records to external standards (Chapter 22). |
| **LRS** | Learning Record Store — an external store of learning activity statements (xAPI). |
| **SCORM** | A legacy standard for packaging and sequencing learning content. |
| **xAPI** | A standard for expressing learning activity as statements (learning records). |
| **LTI** | Learning Tools Interoperability — a standard for integrating external tools into courses. |
| **Open Badges** | A portable, machine-verifiable standard for digital badges. |
| **ORCID** | A persistent identifier for researchers. |
| **DOI** | A persistent identifier for scholarly outputs. |
| **ROR** | A persistent identifier for research organisations. |
| **CRIS** | Current Research Information System — institutional research administration. |
| **Multi-tenancy** | Operating many institution tenants on shared canonical infrastructure (Chapter 21). |

# Appendix B — Traceability

| Requirement | Governing Chapter(s) |
|---|---|
| Platform-wide | 2, 14, 21 |
| Technology-neutral | Preamble, 16, 22 |
| Future-proof | 4, 16, 18, 23 |
| AI-ready | 7, 13, 17, 18, 20 |
| Knowledge-graph-ready | 4, 8, 13, 14, 17, 18, 22 |
| CRIE-ready | 13, 14, 17, 18, 20 |
| Scalable | 2, 4, 17, 21 |
| Modular | 5, 14, 16, 23 |
| Production-grade | 15, 17, 21 |
| Global higher education | 1, 2, 16, 21, 22 |
| Analytics privacy and disclosure control | 15, 17 |
| Multi-tenancy readiness | 15, 21 |
| Global interoperability | 9, 19, 22 |
| Lifelong scholarly portfolio | 9, 19 |
| Adaptive personalisation | 8, 13, 18 |
| Institutional deployment | 21 |

---

*End of SLEA. This is a constitutional architecture document. No implementation,
no code, no commits, and no governance updates are derived from it. The
functional specification (Mission 003-B) is the next deliverable.*
