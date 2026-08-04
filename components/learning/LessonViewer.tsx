'use client';

import Button from '@/components/ui/Button';
import { ProgressBadge } from './Badges';
import { activityKindIcon, activityKindLabel, nodeTypeIcon, progressStateLabel } from './format';
import useLearning from '@/hooks/useLearning';
import type { LearningCourse, LearningLesson, LearningModule } from '@/types/learning';

type LessonViewerProps = {
  course: LearningCourse;
  module: LearningModule;
  lesson: LearningLesson;
  onBackToModule: () => void;
};

export function LessonViewer({ course, module, lesson, onBackToModule }: LessonViewerProps) {
  const { progress, completeLesson } = useLearning();
  const stateOf = (id: string) => progress.find((entry) => entry.learningObjectId === id)?.state ?? 'not-started';
  const lessonState = stateOf(lesson.id);

  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <button
        type="button"
        onClick={onBackToModule}
        className="text-sm font-semibold text-sky-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-sky-400"
      >
        ← {module.title}
      </button>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
            Lesson {lesson.position}
          </p>
          <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">{lesson.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{lesson.description}</p>
        </div>
        <ProgressBadge state={lessonState} />
      </div>

      <div className="mt-6 space-y-5">
        {lesson.topics.map((topic) => (
          <div key={topic.id} className="rounded-2xl border border-slate-200 p-5 dark:border-slate-700">
            <div className="flex items-start justify-between gap-3">
              <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                <span aria-hidden="true">{nodeTypeIcon('topic')}</span>
                {topic.title}
              </h3>
              <ProgressBadge state={stateOf(topic.id)} />
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{topic.description}</p>

            <ul className="mt-4 space-y-2">
              {topic.activities.map((activity) => {
                const state = stateOf(activity.id);
                return (
                  <li
                    key={activity.id}
                    className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800/50"
                  >
                    <span className="flex min-w-0 items-start gap-2">
                      <span aria-hidden="true" className="shrink-0 text-base">
                        {activityKindIcon(activity.kind)}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-slate-800 dark:text-slate-100">
                          {activity.title}
                        </span>
                        <span className="mt-0.5 block text-xs text-slate-400">{activityKindLabel(activity.kind)}</span>
                      </span>
                    </span>
                    <span className="shrink-0 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {progressStateLabel(state)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-5 dark:border-slate-800">
        {lessonState === 'completed' ? (
          <Button variant="outline" disabled>
            Lesson completed
          </Button>
        ) : (
          <Button onClick={() => completeLesson(course.id, lesson.id)}>Mark lesson complete</Button>
        )}
      </div>
    </section>
  );
}
