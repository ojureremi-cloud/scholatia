'use client';

import StatisticCard from '@/components/ui/StatisticCard';
import { ProgressBar } from './ProgressBar';
import { formatNumber, formatPercent, formatPercentRatio } from './format';
import useLearning from '@/hooks/useLearning';

export function StatisticsPanel() {
  const { statistics } = useLearning();
  const { statistics: stats, kpis, analytics } = statistics();

  const headline = [
    { title: 'Courses', value: formatNumber(stats.totalCourses), icon: '📘' },
    { title: 'Programmes', value: formatNumber(stats.totalProgrammes), icon: '🎓' },
    { title: 'Modules', value: formatNumber(stats.totalModules), icon: '🗂️' },
    { title: 'Lessons', value: formatNumber(stats.totalLessons), icon: '📖' },
    { title: 'Assessments', value: formatNumber(stats.totalAssessments), icon: '✅' },
    { title: 'Credentials', value: formatNumber(stats.totalCertificates + stats.totalBadges), icon: '🎖️' },
    { title: 'Mentors', value: formatNumber(stats.totalMentors), icon: '🧭' },
    { title: 'Events', value: formatNumber(stats.totalEvents), icon: '📅' },
  ];

  const kpiRows = [
    { label: 'Progress rate', value: kpis.progressRate },
    { label: 'Completion rate', value: kpis.completionRate },
    { label: 'Retention rate', value: kpis.retentionRate },
    { label: 'Engagement index', value: kpis.engagementIndex },
    { label: 'Competency attainment', value: kpis.competencyAttainment },
  ];

  const breakdownRows = [
    { label: 'Course completion', value: analytics.completion.percent, detail: formatPercentRatio(analytics.completion.numerator, analytics.completion.denominator) },
    { label: 'Competency coverage', value: analytics.competency.percent, detail: formatPercentRatio(analytics.competency.numerator, analytics.competency.denominator) },
    { label: 'Portfolio coverage', value: analytics.portfolio.percent, detail: formatPercentRatio(analytics.portfolio.numerator, analytics.portfolio.denominator) },
    { label: 'CPD attainment', value: analytics.cpd.percent, detail: `${formatNumber(analytics.cpd.hours)}h of ${formatNumber(analytics.cpd.targetHours ?? 40)}h` },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {headline.map((card) => (
          <StatisticCard key={card.title} title={card.title} value={card.value} icon={card.icon} />
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Learner KPIs
          </h2>
          <ul className="mt-5 space-y-4">
            {kpiRows.map((row) => (
              <li key={row.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-300">{row.label}</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{formatPercent(row.value)}</span>
                </div>
                <ProgressBar percent={row.value} className="mt-2" />
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Analytics breakdown
          </h2>
          <ul className="mt-5 space-y-4">
            {breakdownRows.map((row) => (
              <li key={row.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-300">{row.label}</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{row.detail}</span>
                </div>
                <ProgressBar percent={row.value} className="mt-2" />
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs leading-5 text-slate-400">
            Velocity {formatNumber(analytics.velocity)} · retention {formatPercent(analytics.retention)} · engagement{' '}
            {formatPercent(analytics.engagement)}
          </p>
        </section>
      </div>
    </div>
  );
}
