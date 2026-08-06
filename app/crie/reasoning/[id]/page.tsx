import { notFound } from 'next/navigation';
import { crieReasoningModel } from '@/components/crie/data';
import { CRIEBreadcrumb, CRIEHeader, CRIELayout, ReasoningCrumb } from '@/components/crie';
import { ReasoningTraceDetail } from '@/components/crie/reasoning';
import { formatNumber, reasoningParadigmLabel } from '@/components/crie/format';

export default async function CRIEReasoningTracePage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const model = crieReasoningModel();
  const trace = model.traces.find((candidate) => candidate.id === id);
  if (!trace) notFound();

  return (
    <CRIELayout>
      <CRIEBreadcrumb crumbs={[ReasoningCrumb(), { label: trace.id }]} />
      <CRIEHeader
        title={trace.conclusion ? trace.conclusion.statement : trace.id}
        subtitle={`Reasoning trace — ${reasoningParadigmLabel(trace.paradigm)} · ${formatNumber(trace.steps.length)} steps · ${trace.id}`}
      />
      <ReasoningTraceDetail trace={trace} />
    </CRIELayout>
  );
}
