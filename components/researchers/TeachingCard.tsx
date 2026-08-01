'use client';

import type { ResearcherProfile } from '@/types/researcher';

type TeachingCardProps = {
  researcher: ResearcherProfile;
  className?: string;
};

export default function TeachingCard({ researcher, className = '' }: TeachingCardProps) {
  const { teaching } = researcher;
  if (teaching.courses.length === 0) {
    return (
      <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
        <h3 className="text-lg font-semibold text-slate-900">Teaching</h3>
        <p className="mt-3 text-sm text-slate-600">{teaching.teachingExperience}</p>
      </section>
    );
  }
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Teaching</h3>
      <p className="mt-1 text-sm text-slate-600">
        {teaching.teachingExperience} • {teaching.totalStudents} students across {teaching.totalCourses} courses
      </p>
      <ul className="mt-5 space-y-3">
        {teaching.courses.map((course) => (
          <li key={course.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-sm font-semibold text-slate-900">
              {course.title}
              {course.code ? <span className="ml-2 font-mono text-xs text-slate-500">{course.code}</span> : null}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {course.level} • {course.institution} • {course.yearsTaught}
            </p>
            {course.rating ? <p className="mt-1 text-sm text-slate-500">Student rating: {course.rating}/5</p> : null}
          </li>
        ))}
      </ul>
      {teaching.teachingAwards && teaching.teachingAwards.length > 0 ? (
        <p className="mt-4 text-sm text-slate-600">
          <span className="font-medium text-slate-900">Teaching awards: </span>
          {teaching.teachingAwards.join(', ')}
        </p>
      ) : null}
    </section>
  );
}
