import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import SectionCard from '@/components/ui/SectionCard';
import Alert from '@/components/ui/Alert';
import {
  DatasetCard,
  DatasetSummary,
  DatasetStatistics,
  DatasetTimeline,
  DatasetVersionHistory,
  DatasetMetadataCard,
  DatasetAccessCard,
  DatasetContributorCard,
  DatasetCitationCard,
  DatasetDownloadCard,
  DatasetLicenseCard,
  DatasetVerificationCard,
  DatasetCollectionCard,
  DatasetRelationshipCard,
  DatasetTagList,
} from '@/components/datasets';
import {
  DATASETS,
  DATASET_COLLECTIONS,
  DATASET_TIMELINE_ENTRIES,
  DATASET_ANALYTICS,
  RECENT_DATASETS,
  FEATURED_DATASET,
} from '@/constants/placeholder-datasets';

export default function DatasetsPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Datasets"
          subtitle="Curate, publish, and track research datasets at the Dataset stage of the research lifecycle."
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" size="sm" href="/projects">
                Projects
              </Button>
              <Button variant="outline" size="sm" href="/research">
                Research dashboard
              </Button>
            </div>
          }
        />

        <section>
          <SectionTitle
            eyebrow="Overview"
            title="Dataset statistics"
            description="An aggregate snapshot of your published and managed research datasets."
          />
          <div className="mt-8">
            <DatasetStatistics analytics={DATASET_ANALYTICS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Overview"
            title="All datasets"
            description="Every dataset in the Scholatia dataset portfolio, ordered by access and status."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {DATASETS.map((dataset) => (
              <DatasetCard key={dataset.id} dataset={dataset} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Collections"
            title="Browse by collection"
            description="Datasets grouped into reusable collections across the portfolio."
          />
          <div className="mt-8">
            <DatasetCollectionCard collections={DATASET_COLLECTIONS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Spotlight"
            title={`Inside: ${FEATURED_DATASET.title}`}
            description="Metadata, versions, licensing, downloads, citations, and verification for a single dataset."
          />
          <div className="mt-6">
            <DatasetTagList tags={FEATURED_DATASET.tags} />
          </div>
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div className="space-y-8">
              <SectionCard eyebrow="Metadata" title="Dataset metadata" description="Provenance, methodology, and file-level details.">
                <DatasetMetadataCard dataset={FEATURED_DATASET} />
              </SectionCard>
              <SectionCard eyebrow="Access" title="Access level" description="How the dataset can be accessed and reused.">
                <DatasetAccessCard dataset={FEATURED_DATASET} />
              </SectionCard>
              <SectionCard eyebrow="Licensing" title="Licenses" description="Legal terms governing reuse of the data.">
                <DatasetLicenseCard licenses={FEATURED_DATASET.licenses} />
              </SectionCard>
              <SectionCard eyebrow="Verification" title="Verification status" description="Integrity and review checks applied to the data.">
                <DatasetVerificationCard dataset={FEATURED_DATASET} />
              </SectionCard>
            </div>
            <div className="space-y-8">
              <SectionCard eyebrow="Versions" title="Version history" description="Published releases and revisions of the dataset.">
                <DatasetVersionHistory versions={FEATURED_DATASET.versions} />
              </SectionCard>
              <SectionCard eyebrow="Downloads" title="Download information" description="Usage statistics and available download formats.">
                <DatasetDownloadCard dataset={FEATURED_DATASET} />
              </SectionCard>
              <SectionCard eyebrow="Contributors" title="Contributors" description="Researchers and roles credited on the dataset.">
                <DatasetContributorCard contributors={FEATURED_DATASET.contributors} />
              </SectionCard>
              <SectionCard eyebrow="Citations" title="Dataset citations" description="How to cite the dataset and works that reference it.">
                <DatasetCitationCard dataset={FEATURED_DATASET} />
              </SectionCard>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Relationships"
            title="Related projects"
            description="Research projects, grants, and institutions connected to the featured dataset."
          />
          <div className="mt-8">
            <SectionCard eyebrow="Project context" title={FEATURED_DATASET.title}>
              <DatasetRelationshipCard dataset={FEATURED_DATASET} group="project" />
            </SectionCard>
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Relationships"
            title="Related publications"
            description="Publications connected to the featured dataset."
          />
          <div className="mt-8">
            <SectionCard eyebrow="Outputs" title="Linked publications">
              <DatasetRelationshipCard dataset={FEATURED_DATASET} group="publication" />
            </SectionCard>
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Timeline"
            title="Dataset timeline"
            description="Key collection, version, verification, and publication events across datasets."
          />
          <div className="mt-8">
            <SectionCard eyebrow="Lifecycle" title="Recent dataset activity">
              <DatasetTimeline entries={DATASET_TIMELINE_ENTRIES} />
            </SectionCard>
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Recent"
            title="Recently published"
            description="The most recently published and updated datasets."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {RECENT_DATASETS.map((dataset) => (
              <DatasetCard key={dataset.id} dataset={dataset} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Analytics"
            title="Dataset analytics"
            description="Access, usage, and download signals across the dataset portfolio."
          />
          <div className="mt-8">
            <DatasetSummary analytics={DATASET_ANALYTICS} />
          </div>
        </section>

        <div className="mt-16">
          <Alert
            variant="warning"
            title="Dataset data is illustrative"
            description="Datasets, versions, licenses, contributors, citations, and statistics shown here are placeholders. Live data will be connected to data repositories, DOIs, and your Scholatia records."
          />
        </div>
      </Container>
    </PageLayout>
  );
}
