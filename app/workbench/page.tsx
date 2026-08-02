import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import Alert from '@/components/ui/Alert';
import { ArtefactViewer, WorkbenchItemCard, WorkbenchStatistics } from '@/components/workbench';
import {
  DEFAULT_ARTEFACT,
  DEFAULT_WORKBENCH,
  THESIS_ARTEFACT_DATA,
} from '@/constants/placeholder-workflows';

export default function WorkbenchPage() {
  const items = DEFAULT_WORKBENCH.items;

  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Research Workbench"
          subtitle="The private working surface of the researcher, powered by lib/workflows.ts. Nothing enters a workflow until it is promoted — workbench items are private notes, outlines, references, clippings, datasets, calculations, voice notes, AI notes, draft sections, and draft chapters that accumulate before they become scholarly artefacts. Artefacts (thesis, manuscript, proposal, grant, report) are composed of chapters and reviewable sections with derived word counts, and are promoted into workflows only when ready."
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" size="sm" href="/workflows">
                Workflows
              </Button>
              <Button variant="secondary" size="sm" href="/tasks">
                Tasks
              </Button>
              <Button variant="outline" size="sm" href="/reviews">
                Reviews & Approvals
              </Button>
            </div>
          }
        />

        <section>
          <SectionTitle
            eyebrow="Engine overview"
            title="Workbench statistics"
            description="Items across the private workbench — total, active, drafts, promoted, and archived, computed by the engine."
          />
          <div className="mt-8">
            <WorkbenchStatistics workbench={DEFAULT_WORKBENCH} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Private surface"
            title="Workbench items"
            description="Notes, outlines, references, clippings, datasets, calculations, voice notes, AI notes, and draft sections — private until promoted into a workflow or artefact."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <WorkbenchItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Artefact"
            title="Manuscript artefact"
            description="A scholarly artefact composed of chapters and reviewable sections — each with an independent review lifecycle, tracked by the engine."
          />
          <div className="mt-8">
            <ArtefactViewer artefact={DEFAULT_ARTEFACT} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Artefact"
            title="Thesis artefact"
            description="The thesis artefact promoted from the workbench — chapters with derived word counts and per-section statuses feeding the thesis workflow."
          />
          <div className="mt-8">
            <ArtefactViewer artefact={THESIS_ARTEFACT_DATA} />
          </div>
        </section>

        <div className="mt-16">
          <Alert
            variant="warning"
            title="Workbench data is illustrative"
            description="All workbench items, versions, artefacts, chapters, and sections are placeholder data computed by the pure engine in lib/workflows.ts. Items reference source records through IDs only, and promoted artefacts reference their workflow instance without duplicating it. Live ingestion will connect the workbench to manuscript and thesis modules in later phases."
          />
        </div>
      </Container>
    </PageLayout>
  );
}
