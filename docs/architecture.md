# Scholatia Architecture

## Platform positioning

Scholatia is a global scholarly infrastructure platform connecting students, researchers, academics, institutions, journals, conferences, publishers, funding organisations and professional associations within one trusted ecosystem.

## Scholatia Academic Identity (SAID)

Scholatia Academic Identity (SAID) is the universal verified identity layer for all Scholatia members.

- Every registered user receives a unique Scholatia Academic Identity.
- Example format: `SAID-000000001`.
- SAID enables authentication, verification, role-based access control, audit trails and trust scoring.

## Role system

Scholatia supports a multi-role identity architecture:

Individual roles:

- Student
- Researcher
- Lecturer
- Professor
- Reviewer
- Editor
- Author
- Mentor
- Conference Participant

Organisational roles:

- Institution Administrator
- Journal Administrator
- Publisher
- Funding Organisation Administrator
- Professional Association Administrator

Users may hold multiple roles simultaneously.

## Student ecosystem support

Students on Scholatia have access to:

- Student profile
- Academic portfolio
- Research interests
- Publications
- Projects
- Certificates
- Scholarships
- Funding opportunities
- Conferences
- Mentorship
- Academic communities
- Career opportunities

## Navigation and taxonomy

The platform navigation centers around:

- People
- Institutions
- Journals
- Conferences
- Publishers
- Funding Organisations

People includes students, researchers, academics, professionals, reviewers and editors.

Institutions is the primary organisational category and includes universities, colleges, polytechnics, institutes, academies, research centres, laboratories, teaching hospitals, professional schools, think tanks, government research organisations and international education organisations.

## Future database tables

Prepare the architecture for future persistence with the following entities:

- `Users`
- `Profiles`
- `AcademicIdentities`
- `Roles`
- `Institutions`
- `InstitutionTypes`
- `StudentProfiles`
- `ResearcherProfiles`
- `AcademicActivities`
- `VerificationRecords`

## Design principles

- Maintain enterprise SaaS quality
- Support global academic standards
- Ensure accessibility compliance
- Keep the architecture scalable and extensible
