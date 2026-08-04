'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { CourseHeader } from './CourseHeader';
import { CurriculumTree } from './CurriculumTree';
import type { CourseSelection } from './CurriculumTree';
import { ModuleViewer } from './ModuleViewer';
import { LessonViewer } from './LessonViewer';
import { AssessmentSummary } from './AssessmentSummary';
import { LearningEmptyState } from './LearningEmptyState';
import { formatNumber, nodeTypeIcon } from './format';
import useLearning from '@/hooks/useLearning';
import type { LearningModule } from '@/types/learning';

type CourseDetailProps = {
  courseId: string;
};

export function CourseDetail({ courseId }: CourseDetailProps) {
  const { allCourses, progressOf } = useLearning();
  const searchParams = useSearchParams();
  const moduleParam = searchParams.get('module');
  const lessonParam = searchParams.get('lesson');

  const course = useMemo(() => allCourses.find((entry) => entry.id === courseId), [allCourses, courseId]);
  const progress = useMemo(() => (course ? progressOf(course) : undefined), [course, progressOf]);

  const [selection, setSelection] = useState<CourseSelection>(() => {
    if (!course) return null;
    if (lessonParam) {
      for (const moduleEntry of course.modules) {
        const lesson = moduleEntry.lessons.find((entry) => entry.slug === lessonParam);
        if (lesson) return { module: moduleEntry, lesson };
      }
    }
    if (moduleParam) {
      const moduleEntry = course.modules.find((entry) => entry.slug === moduleParam);
      if (moduleEntry) return { module: moduleEntry };
    }
    return null;
  });

  if (!course || !progress) {
    return <LearningEmptyState title="Course not found" description="The course you are looking for does not exist." />;
  }

  const selectModule = (module: LearningModule) => setSelection({ module });
  const backToModule = () => setSelection(selection?.module ? { module: selection.module } : null);

  return (
    <div className="space-y-8">
      <CourseHeader course={course} />

      <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
        <div className="lg:sticky lg:top-6 lg:self-start">
          <CurriculumTree course={course} selection={selection} onSelect={setSelection} />
        </div>

        <div className="min-w-0 space-y-6">
          {selection?.lesson ? (
            <LessonViewer course={course} module={selection.module} lesson={selection.lesson} onBackToModule={backToModule} />
          ) : selection?.module ? (
            <ModuleViewer
              course={course}
              module={selection.module}
              onSelectLesson={(lesson) => setSelection({ module: selection.module, lesson })}
            />
          ) : (
            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Overview
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                This course has {formatNumber(course.modules.length)} module{course.modules.length === 1 ? '' : 's'} and{' '}
                {formatNumber(progress.total)} learning activities in total. Use the curriculum to open a module or
                lesson, or start from the first module below.
              </p>
              <ul className="mt-5 space-y-2">
                {course.modules.map((module, index) => (
                  <li key={module.id}>
                    <button
                      type="button"
                      onClick={() => selectModule(module)}
                      className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition hover:border-sky-300 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-sky-700 dark:hover:bg-slate-800"
                    >
                      <span aria-hidden="true" className="text-lg">
                        {nodeTypeIcon('module')}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-slate-800 dark:text-slate-100">
                          {index + 1}. {module.title}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-slate-400">{module.description}</span>
                      </span>
                      <span className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                        {module.lessons.length} lesson{module.lessons.length === 1 ? '' : 's'}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <AssessmentSummary course={course} />
        </div>
      </div>
    </div>
  );
}
