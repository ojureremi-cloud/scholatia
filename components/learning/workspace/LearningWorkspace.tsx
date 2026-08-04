'use client';

import Button from '@/components/ui/Button';
import { ProgressBar } from '../ProgressBar';
import { WorkspaceLayout } from './WorkspaceLayout';
import { WorkspaceSidebar } from './WorkspaceSidebar';
import { WorkspaceHero } from './WorkspaceHero';
import { WorkspaceQuickActions } from './WorkspaceQuickActions';
import { WorkspaceStatistics } from './WorkspaceStatistics';
import { WorkspaceActivity } from './WorkspaceActivity';
import { WorkspaceTimeline } from './WorkspaceTimeline';
import { WorkspaceNotifications } from './WorkspaceNotifications';
import { WorkspaceCalendar } from './WorkspaceCalendar';
import { WorkspaceWidgets } from './WorkspaceWidgets';
import { WorkspaceRecommendations } from './WorkspaceRecommendations';
import { LearningNotes } from './LearningNotes';
import { LearningHighlights } from './LearningHighlights';
import { BookmarksPanel } from './BookmarksPanel';
import { LearningJournal } from './LearningJournal';
import { CompetencyRadar } from './CompetencyRadar';
import { GoalTracker } from './GoalTracker';
import { PortfolioWorkspace } from './PortfolioWorkspace';
import { PassportWorkspace } from './PassportWorkspace';
import { WorkspaceEmptyState } from './WorkspaceEmptyState';
import { courseUrl, lessonUrl, moduleUrl, programmeUrl } from '../format';
import useLearning from '@/hooks/useLearning';

export function LearningWorkspace() {
  const { workspace } = useLearning();
  const model = workspace();

  const current = model.current;
  const resumeHref = current
    ? current.lesson
      ? lessonUrl(current.course, current.lesson)
      : current.module
        ? moduleUrl(current.course, current.module)
        : courseUrl(current.course)
    : undefined;

  return (
    <WorkspaceLayout sidebar={<WorkspaceSidebar />}>
      <WorkspaceHero />
      <WorkspaceQuickActions />
      <WorkspaceStatistics />

      {current ? (
        <section className="rounded-[2rem] bg-gradient-to-br from-sky-700 via-sky-600 to-teal-500 p-8 text-white shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-100">Continue learning</p>
              <h2 className="mt-2 text-2xl font-semibold">{current.course.title}</h2>
              <p className="mt-1 text-sm text-sky-100">
                {current.module ? `Module: ${current.module.title}` : 'Module: —'}
                {current.lesson ? ` · Lesson: ${current.lesson.title}` : ''}
              </p>
              {model.programme ? (
                <a
                  href={programmeUrl(model.programme)}
                  className="mt-2 inline-block text-xs font-semibold text-sky-100 underline underline-offset-2"
                >
                  {model.programme.title}
                </a>
              ) : null}
            </div>
            {resumeHref ? (
              <Button href={resumeHref} variant="primary" className="!bg-white !text-sky-700 hover:!bg-sky-50">
                Resume
              </Button>
            ) : null}
          </div>
          <div className="mt-6">
            <ProgressBar percent={current.progress.percent} className="!bg-white/25" />
            <p className="mt-2 text-xs text-sky-100">
              {current.progress.completed} of {current.progress.total} objects complete · {Math.round(current.progress.percent)}%
            </p>
          </div>
        </section>
      ) : (
        <WorkspaceEmptyState title="Nothing in progress" description="Enrol in a course to begin your next learning session." />
      )}

      <WorkspaceWidgets>
        <WorkspaceActivity />
        <WorkspaceCalendar />
      </WorkspaceWidgets>

      <WorkspaceRecommendations />

      <WorkspaceWidgets>
        <LearningNotes />
        <LearningHighlights />
      </WorkspaceWidgets>

      <WorkspaceWidgets>
        <BookmarksPanel />
        <LearningJournal />
      </WorkspaceWidgets>

      <WorkspaceWidgets>
        <CompetencyRadar />
        <GoalTracker />
      </WorkspaceWidgets>

      <WorkspaceWidgets>
        <PortfolioWorkspace />
        <PassportWorkspace />
      </WorkspaceWidgets>

      <WorkspaceTimeline />
      <WorkspaceNotifications />
    </WorkspaceLayout>
  );
}
