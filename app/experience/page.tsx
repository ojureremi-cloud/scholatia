import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import SectionCard from '@/components/ui/SectionCard';
import { EmploymentTimeline } from '@/components/identity';
import { PLACEHOLDER_EMPLOYMENT } from '@/constants/placeholder-profile';

const teachingExperience = [
  { course: 'Multilingual Natural Language Processing', role: 'Course Lecturer', period: '2022 - Present' },
  { course: 'Corpus Linguistics and Annotation', role: 'Guest Lecturer', period: '2020 - Present' },
  { course: 'Introduction to Computational Linguistics', role: 'Teaching Assistant', period: '2011 - 2012' },
];

const supervision = [
  { student: 'Doctoral supervision', detail: '2 PhD candidates in multilingual NLP', period: '2021 - Present' },
  { student: 'Master’s supervision', detail: '8 MSc dissertations supervised', period: '2016 - Present' },
];

export default function ExperiencePage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Experience"
          subtitle="Professional and academic employment history."
        />
        <div className="mt-8 max-w-3xl">
          <EmploymentTimeline employmentHistory={PLACEHOLDER_EMPLOYMENT} />
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <SectionCard eyebrow="Teaching" title="Teaching experience" description="Courses taught and contributed to throughout your career.">
            <div className="space-y-3">
              {teachingExperience.map((entry) => (
                <div key={`${entry.course}-${entry.role}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">{entry.course}</p>
                  <p className="mt-1 text-sm text-slate-600">{entry.role}</p>
                  <p className="mt-1 text-sm text-slate-500">{entry.period}</p>
                </div>
              ))}
            </div>
          </SectionCard>
          <SectionCard eyebrow="Supervision" title="Research supervision" description="Mentoring and supervision of research students.">
            <div className="space-y-3">
              {supervision.map((entry) => (
                <div key={entry.student} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">{entry.student}</p>
                  <p className="mt-1 text-sm text-slate-600">{entry.detail}</p>
                  <p className="mt-1 text-sm text-slate-500">{entry.period}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </Container>
    </PageLayout>
  );
}
