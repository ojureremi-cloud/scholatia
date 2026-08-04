'use client';

import { nodeTypeIcon } from './format';
import useLearning from '@/hooks/useLearning';
import type { LearningCourse, LearningLesson, LearningModule } from '@/types/learning';

export type CourseSelection = { module: LearningModule; lesson?: LearningLesson } | null;

type CurriculumTreeProps = {
  course: LearningCourse;
  selection: CourseSelection;
  onSelect: (selection: CourseSelection) => void;
};

export function CurriculumTree({ course, selection, onSelect }: CurriculumTreeProps) {
  const { progress } = useLearning();
  const stateOf = (id: string) => progress.find((entry) => entry.learningObjectId === id)?.state;

  return (
    <nav aria-label={`${course.title} curriculum`} className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <p className="px-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        Curriculum
      </p>
      <ul className="mt-3 space-y-1">
        {course.modules.map((module) => {
          const moduleActive = selection?.module.id === module.id && !selection.lesson;
          return (
            <li key={module.id}>
              <button
                type="button"
                onClick={() => onSelect({ module })}
                aria-current={moduleActive ? 'true' : undefined}
                className={[
                  'flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500',
                  moduleActive
                    ? 'bg-sky-50 text-sky-700 dark:bg-sky-900/50 dark:text-sky-200'
                    : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span aria-hidden="true">{nodeTypeIcon('module')}</span>
                <span className="min-w-0 flex-1 truncate">{module.title}</span>
                {stateOf(module.id) === 'completed' ? (
                  <span className="text-emerald-500" aria-label="completed">✓</span>
                ) : stateOf(module.id) === 'in-progress' ? (
                  <span className="text-amber-500" aria-label="in progress">●</span>
                ) : null}
              </button>

              <ul className="ml-4 mt-1 space-y-0.5 border-l border-slate-200 pl-2 dark:border-slate-700">
                {module.lessons.map((lesson) => {
                  const lessonActive = selection?.lesson?.id === lesson.id;
                  return (
                    <li key={lesson.id}>
                      <button
                        type="button"
                        onClick={() => onSelect({ module, lesson })}
                        aria-current={lessonActive ? 'true' : undefined}
                        className={[
                          'flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500',
                          lessonActive
                            ? 'bg-sky-50 text-sky-700 dark:bg-sky-900/50 dark:text-sky-200'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        <span aria-hidden="true">{nodeTypeIcon('lesson')}</span>
                        <span className="min-w-0 flex-1 truncate">{lesson.title}</span>
                        {stateOf(lesson.id) === 'completed' ? (
                          <span className="text-emerald-500" aria-label="completed">✓</span>
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
