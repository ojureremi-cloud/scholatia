import Button from '@/components/ui/Button';
import { coursesUrl, programmesUrl } from './format';

export function LearningHero() {
  return (
    <section className="rounded-[2rem] bg-gradient-to-br from-sky-700 via-sky-600 to-teal-500 p-8 text-white shadow-lg sm:p-12">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-100">Scholatia Learning Ecosystem</p>
      <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
        Build the research skills that move your career forward.
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-sky-50 sm:text-base">
        Explore courses, programmes, and personal learning paths curated for researchers — with progress tracking,
        credentials, and mentoring built in.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button href={coursesUrl()} variant="primary" className="!bg-white !text-sky-700 hover:!bg-sky-50">
          Browse courses
        </Button>
        <Button
          href={programmesUrl()}
          variant="outline"
          className="!border-white/40 !text-white hover:!border-white hover:!bg-white/10"
        >
          View programmes
        </Button>
      </div>
    </section>
  );
}
