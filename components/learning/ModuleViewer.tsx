'use client';

import Button from '@/components/ui/Button';
import { ProgressBadge } from './Badges';
import { nodeTypeIcon, progressStateLabel } from './format';
import useLearning from '@/hooks/useLearning';
import type { LearningCourse, LearningLesson, LearningModule } from '@/types/learning';

type ModuleViewerProps = {
  course: LearningCourse;
  module: LearningModule;
  onSelectLesson: (lesson: LearningLesson) => void;
};

export function ModuleViewer({ course, module, onSelectLesson }: ModuleViewerProps) {
  const { progress, completeModule } = useLearning();

  const stateOf = (id: string) => progress.find((entry) => entry.learningObjectId === id)?.state ?? 'not-started';
  const moduleState = stateOf(module.id);
  const lessonStates = module.lessons.map((lesson) => ({
    lesson,
    state: stateOf(lesson.id),
  }));
  const completedLessons = lessonStates.filter(({ state }) => state === 'completed').length;

  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
            Module {module.position}
          </p>
          <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">{module.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{module.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <ProgressBadge state={moduleState} />
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {completedLessons}/{module.lessons.length} lessons
          </span>
        </div>
      </div>

      <ol className="mt-6 space-y-3">
        {module.lessons.map((lesson, index) => {
          const state = stateOf(lesson.id);
          return (
            <li key={lesson.id}>
              <button
                type="button"
                onClick={() => onSelectLesson(lesson)}
                className="flex w-full items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition hover:border-sky-300 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-sky-700 dark:hover:bg-slate-800"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-lg shadow-sm dark:bg-slate-900">
                    <span aria-hidden="true">{nodeTypeIcon('lesson')}</span>
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {index + 1}. {lesson.title}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-slate-400">{lesson.description}</span>
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <span className="hidden text-xs text-slate-400 sm:inline">{progressStateLabel(state)}</span>
                  <span className="text-slate-400" aria-hidden="true">→</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
        {moduleState === 'completed' ? (
          <Button variant="outline" disabled>
            Module completed
          </Button>
        ) : (
          <Button onClick={() => completeModule(course.id, module.id)}>Mark module complete</Button>
        )}
      </div>
    </section>
  );
}
