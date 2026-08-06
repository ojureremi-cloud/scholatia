import { crieCareerGoals, crieCareerSignals, crieMentorshipGuidance, crieSupervisionRecords } from '@/lib/crie/access';
import { crieCollaborationModel } from '../data';
import { Panel, Stack, Chip } from '../primitives';
import { formatDate, statusTone } from '../format';

function NumericRows(stats: object) {
  const rows = Object.entries(stats).filter(([, value]) => typeof value === 'number');
  return rows.map(([key, value]) => (
    <div key={key} className="flex items-center justify-between gap-4 text-sm">
      <dt className="text-slate-500 dark:text-slate-400">{key}</dt>
      <dd className="font-semibold text-slate-900 dark:text-slate-100">{value as number}</dd>
    </div>
  ));
}

export function CollaborationAnalytics() {
  const careerGoal = crieCareerGoals()[0];
  const careerSignal = crieCareerSignals()[0];
  if (!careerGoal || !careerSignal) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">No career profile is available.</p>;
  }
  const model = crieCollaborationModel({
    careerGoal,
    careerSignal,
    supervisionRecords: crieSupervisionRecords(),
    mentorshipGuidance: crieMentorshipGuidance(),
  });

  return (
    <Stack>
      <Panel eyebrow="Research analytics" title="Career goal" icon="🎯">
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">{model.careerGoal.statement}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Chip tone={statusTone(model.careerGoal.goalStatus)}>{model.careerGoal.goalStatus}</Chip>
          <Chip>horizon {model.careerGoal.horizonMonths} months</Chip>
        </div>
      </Panel>

      <Panel eyebrow="Research analytics" title="Career signal" icon="📡">
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">{model.careerSignal.statement}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Chip tone="info">{model.careerSignal.kind}</Chip>
          <Chip>confidence {Math.round(model.careerSignal.confidence.value * 100)}%</Chip>
          <Chip>{formatDate(model.careerSignal.derivedAt)}</Chip>
        </div>
      </Panel>

      <div className="grid gap-8 lg:grid-cols-2">
        <Panel eyebrow="Collaboration" title="Supervision" icon="🧑‍🏫">
          <dl className="space-y-2">{NumericRows(model.supervisionStatistics)}</dl>
        </Panel>
        <Panel eyebrow="Collaboration" title="Mentorship" icon="🤝">
          <dl className="space-y-2">{NumericRows(model.mentorshipStatistics)}</dl>
        </Panel>
      </div>
    </Stack>
  );
}
