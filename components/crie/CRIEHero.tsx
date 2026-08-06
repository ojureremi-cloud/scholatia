import Button from '@/components/ui/Button';
import { crieDashboardUrl, crieResearchUrl } from './format';

type CRIEHeroProps = {
  researcherName?: string;
};

export function CRIEHero({ researcherName = 'Researcher' }: CRIEHeroProps) {
  return (
    <section className="rounded-[2rem] bg-gradient-to-br from-indigo-700 via-indigo-600 to-sky-500 p-8 text-white shadow-lg sm:p-12">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-100">
        Scholatia Cognitive Research Intelligence
      </p>
      <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
        Welcome back, {researcherName}. Your research environment is ready.
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-indigo-50 sm:text-base">
        CRIE assembles your context, manages your knowledge graph and memory, coordinates your agents, and
        explains every recommendation — so you stay in control of the research lifecycle.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button href={crieResearchUrl()} variant="primary" className="!bg-white !text-indigo-700 hover:!bg-indigo-50">
          Open research workspace
        </Button>
        <Button
          href={crieDashboardUrl()}
          variant="ghost"
          className="!border-white/40 !text-white hover:!bg-white/10"
        >
          View dashboard
        </Button>
      </div>
    </section>
  );
}
