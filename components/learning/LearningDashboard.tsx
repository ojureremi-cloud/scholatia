'use client';

import Link from 'next/link';
import StatisticCard from '@/components/ui/StatisticCard';
import { LearningHero } from './LearningHero';
import { LearningSidebar } from './LearningSidebar';
import { RecommendationPanel } from './RecommendationPanel';
import { LearningTimeline } from './LearningTimeline';
import { CertificatePanel } from './CertificatePanel';
import { BadgePanel } from './BadgePanel';
import { CourseCard } from './CourseCard';
import { LearningEmptyState } from './LearningEmptyState';
import { formatDate, formatPercent } from './format';
import useLearning from '@/hooks/useLearning';

export function LearningDashboard() {
  const { dashboard } = useLearning();
  const model = dashboard();

  const statCards = [
    { title: 'Progress rate', value: formatPercent(model.kpis.progressRate), icon: '📈' },
    { title: 'Completion rate', value: formatPercent(model.kpis.completionRate), icon: '✅' },
    { title: 'Engagement', value: formatPercent(model.kpis.engagementIndex), icon: '🔥' },
    { title: 'Competencies', value: formatPercent(model.kpis.competencyAttainment), icon: '🧠' },
  ];

  return (
    <div className="space-y-10">
      <LearningHero />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <StatisticCard key={card.title} title={card.title} value={card.value} icon={card.icon} />
        ))}
      </section>

      <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div className="min-w-0 space-y-10">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Continue learning</h2>
              <Link
                href="/learning/courses"
                className="text-sm font-semibold text-sky-600 hover:underline dark:text-sky-400"
              >
                Browse courses →
              </Link>
            </div>
            {model.ongoing.length === 0 ? (
              <LearningEmptyState
                title="Nothing in progress"
                description="Enrol in a course to start building your research skills."
              />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {model.ongoing.slice(0, 4).map(({ course }) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </section>

          <RecommendationPanel />
          <LearningTimeline />

          <section className="grid gap-8 xl:grid-cols-2">
            <CertificatePanel />
            <BadgePanel />
          </section>
        </div>

        <div className="space-y-8">
          <LearningSidebar />

          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Upcoming events
            </h2>
            <ul className="mt-4 space-y-4">
              {model.events.slice(0, 3).map((event) => (
                <li key={event.id} className="flex items-start gap-3">
                  <span aria-hidden="true" className="text-xl">
                    📅
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{event.title}</p>
                    <p className="text-xs text-slate-400">{formatDate(event.startAt)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
