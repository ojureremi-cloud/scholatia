'use client';

import Badge from '@/components/ui/Badge';
import { ProgressBar } from '../ProgressBar';
import { WorkspaceWidgets } from './WorkspaceWidgets';
import { WorkspaceEmptyState } from './WorkspaceEmptyState';
import { WorkspaceRecommendations } from './WorkspaceRecommendations';
import {
  courseUrl,
  domainIcon,
  eventKindIcon,
  formatDate,
  formatPercent,
  formatRelative,
  goalStatusLabel,
  goalStatusVariant,
  historyEventTypeLabel,
  pathUrl,
  portfolioKindIcon,
  portfolioKindLabel,
  readingKindIcon,
  workflowKindLabel,
} from '../format';
import useLearning from '@/hooks/useLearning';

export function StudentHome() {
  const { studentHome } = useLearning();
  const model = studentHome();

  return (
    <>
      <section className="rounded-[2rem] bg-gradient-to-br from-teal-700 via-sky-700 to-indigo-800 p-8 text-white shadow-lg sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-100">Student home</p>
        <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
          Good to see you, {model.learner.name.split(' ')[0]}. Keep the momentum going.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-teal-50">
          Your courses, paths, goals, competencies, and credentials at a glance.
        </p>
      </section>

      {model.resume.length === 0 ? (
        <WorkspaceEmptyState title="Nothing in progress" description="Enrol in a course to start learning." />
      ) : (
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Resume learning
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {model.resume.slice(0, 4).map(({ course, progress }) => (
              <a
                key={course.id}
                href={courseUrl(course)}
                className="rounded-2xl border border-slate-200 p-4 transition hover:border-sky-300 dark:border-slate-700 dark:hover:border-sky-700"
              >
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{course.title}</p>
                <div className="mt-3">
                  <ProgressBar percent={progress.percent} />
                </div>
                <p className="mt-2 text-xs text-slate-400">{Math.round(progress.percent)}% complete</p>
              </a>
            ))}
          </div>
        </section>
      )}

      <WorkspaceWidgets>
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Recent learning
          </h2>
          {model.recentLearning.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">No recent activity.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {model.recentLearning.map((entry) => (
                <li key={entry.id} className="flex items-start gap-3">
                  <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-sky-400" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-sm leading-5 text-slate-700 dark:text-slate-200">{entry.detail}</p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {entry.source === 'workflow'
                        ? workflowKindLabel(entry.kind as Parameters<typeof workflowKindLabel>[0])
                        : historyEventTypeLabel(entry.kind as Parameters<typeof historyEventTypeLabel>[0])}
                      {' '}· {formatRelative(entry.occurredAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Current paths
          </h2>
          {model.currentPaths.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">You are not on any path yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {model.currentPaths.map((path) => (
                <li key={path.id}>
                  <a href={pathUrl(path)} className="text-sm font-semibold text-sky-600 hover:underline dark:text-sky-400">
                    🧭 {path.title}
                  </a>
                  <p className="text-xs text-slate-400">{path.items.length} steps</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </WorkspaceWidgets>

      <WorkspaceWidgets>
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Goals</h2>
          {model.goals.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">No goals set.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {model.goals.slice(0, 4).map((goal) => (
                <li key={goal.id} className="flex items-start justify-between gap-3">
                  <p className="text-sm leading-5 text-slate-700 dark:text-slate-200">{goal.statement}</p>
                  <Badge variant={goalStatusVariant(goal.status)}>{goalStatusLabel(goal.status)}</Badge>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Competencies
            </h2>
            <Badge variant="info">{formatPercent(model.competencies.attainment)}</Badge>
          </div>
          <ul className="mt-4 space-y-3">
            {model.competencies.competencies.slice(0, 4).map((competency) => (
              <li key={competency.key}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {domainIcon(competency.domain)} {competency.name}
                  </p>
                  <span className="text-xs text-slate-400">
                    {competency.currentLevel}/{competency.targetLevel}
                  </span>
                </div>
                <div className="mt-1.5">
                  <ProgressBar percent={(competency.currentLevel / Math.max(1, competency.targetLevel)) * 100} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </WorkspaceWidgets>

      <WorkspaceWidgets>
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Credentials
          </h2>
          {model.certificates.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">No certificates yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {model.certificates.map((certificate) => (
                <li key={certificate.id} className="flex items-start gap-3">
                  <span aria-hidden="true" className="text-xl">📜</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{certificate.title}</p>
                    <p className="text-xs text-slate-400">
                      {certificate.issuerName} · {formatDate(certificate.issuedAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Reading
          </h2>
          {model.reading.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">No readings saved.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {model.reading.slice(0, 4).map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <span aria-hidden="true" className="text-xl">{readingKindIcon(item.kind)}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.title}</p>
                    <p className="text-xs text-slate-400">{Math.round(item.progress)}% read</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </WorkspaceWidgets>

      <WorkspaceWidgets>
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Portfolio
          </h2>
          {model.portfolio.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">No portfolio entries.</p>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {model.portfolio.map((portfolio) => (
                <Badge key={portfolio.id}>
                  {portfolioKindIcon(portfolio.kind)} {portfolioKindLabel(portfolio.kind)} · {portfolio.items.length}
                </Badge>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Upcoming events
          </h2>
          {model.events.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">No upcoming events.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {model.events.map((event) => (
                <li key={event.id} className="flex items-start gap-3">
                  <span aria-hidden="true" className="text-xl">{eventKindIcon(event.kind)}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{event.title}</p>
                    <p className="text-xs text-slate-400">{formatDate(event.startAt)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </WorkspaceWidgets>

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Announcements
        </h2>
        {model.announcements.length === 0 ? (
          <p className="mt-4 text-sm text-slate-400">No announcements.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {model.announcements.map((announcement) => (
              <li key={announcement.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{announcement.title}</p>
                  <span className="shrink-0 text-xs text-slate-400">{formatDate(announcement.publishedAt)}</span>
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{announcement.body}</p>
                <p className="mt-1 text-xs text-slate-400">— {announcement.author}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <WorkspaceRecommendations />
    </>
  );
}
