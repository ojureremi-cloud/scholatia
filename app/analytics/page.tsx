import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import SectionCard from '@/components/ui/SectionCard';
import StatisticCard from '@/components/ui/StatisticCard';
import Alert from '@/components/ui/Alert';
import { CitationChart } from '@/components/identity';
import { PLACEHOLDER_CITATIONS } from '@/constants/placeholder-profile';

const citationTotals = [
  { label: 'Total Citations', value: '1,560' },
  { label: 'H-index', value: '12' },
  { label: 'i10-index', value: '18' },
];

const citationBreakdown = [
  { label: 'Journal articles', percentage: 68 },
  { label: 'Conference papers', percentage: 24 },
  { label: 'Preprints', percentage: 8 },
];

export default function AnalyticsPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Analytics"
          subtitle="Profile views, citation metrics, and research impact statistics."
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {citationTotals.map((stat) => (
            <StatisticCard key={stat.label} title={stat.label} value={stat.value} />
          ))}
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <SectionCard eyebrow="Citations" title="Citations per year" description="Placeholder citation trends by publication year." className="lg:col-span-2">
            <CitationChart data={PLACEHOLDER_CITATIONS} />
          </SectionCard>
          <SectionCard eyebrow="Impact" title="Citations by type" description="Share of citations by publication type.">
            <div className="space-y-4">
              {citationBreakdown.map((entry) => (
                <div key={entry.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{entry.label}</span>
                    <span className="font-semibold text-slate-900">{entry.percentage}%</span>
                  </div>
                  <div className="mt-2 h-3 rounded-full bg-slate-100">
                    <div className="h-3 rounded-full bg-sky-600" style={{ width: `${entry.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
        <div className="mt-8">
          <Alert
            variant="warning"
            title="Charts are placeholders"
            description="Citation charts and metrics shown here are illustrative placeholders. Live analytics will be connected to publication and citation data sources."
          />
        </div>
      </Container>
    </PageLayout>
  );
}
