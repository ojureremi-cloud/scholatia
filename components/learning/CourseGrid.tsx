import { CourseCard } from './CourseCard';
import type { LearningCourse } from '@/types/learning';

type CourseGridProps = {
  courses: LearningCourse[];
};

export function CourseGrid({ courses }: CourseGridProps) {
  if (courses.length === 0) return null;
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
