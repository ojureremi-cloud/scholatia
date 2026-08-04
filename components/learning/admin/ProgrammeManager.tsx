'use client';

import { useState } from 'react';
import StatisticCard from '@/components/ui/StatisticCard';
import useLearning from '@/hooks/useLearning';
import { formatPercent, workflowKindIcon, workflowKindLabel } from '../format';
import { ProgressBar } from '../ProgressBar';
import { Chip, Panel, Row } from '../primitives';
import { AdminEmptyState } from './AdminEmptyState';
import { AdminFilters } from './AdminFilters';
import { AdminHeader } from './AdminHeader';
import { AdminWidgets } from './AdminWidgets';
import { CurriculumBuilder } from './CurriculumBuilder';
import { CurriculumViewer } from './CurriculumViewer';
import { ProgrammeAnalytics } from './ProgrammeAnalytics';

type ProgrammeTab = 'overview' | 'curriculum' | 'analytics';

export function ProgrammeManager() {
  const { programmeManager } = useLearning();
  const model = programmeManager();
  const [tab, setTab] = useState<ProgrammeTab>('overview');

  return (
    <>
      <AdminHeader
        eyebrow="Academic operations"
        title="Programme Manager"
        description="Postgraduate and digital capacity programmes — curriculum, progression, workflows, and approvals."
        icon="🎓"
      />

      <AdminFilters<ProgrammeTab>
        options={[
          { label: 'Overview', value: 'overview' },
          { label: 'Curriculum', value: 'curriculum' },
          { label: 'Analytics', value: 'analytics' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'overview' ? (
        <>
          <AdminWidgets>
            <StatisticCard icon="🎓" title="Programmes" value={String(model.programmes.length)} />
            <StatisticCard icon="🧩" title="Curricula" value={String(model.curricula.length)} />
            <StatisticCard icon="⚙️" title="Workflow events" value={String(model.workflows.reduce((sum, row) => sum + row.count, 0))} />
            <StatisticCard icon="🔎" title="Approval checks" value={String(model.approvals.length)} />
          </AdminWidgets>

          <Panel eyebrow="Programmes" title="Delivery status" icon="🎓">
            {model.programmes.length === 0 ? (
              <AdminEmptyState title="No programmes" description="No programmes are configured yet." />
            ) : (
              <ul className="space-y-4">
                {model.programmes.map((row) => (
                  <li key={row.programme.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{row.programme.title}</p>
                        <p className="text-xs text-slate-400">{row.programme.qualification}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Chip tone="default">{row.courseCount} courses</Chip>
                        <Chip tone="info">{row.curriculaCount} curricula</Chip>
                        <Chip tone={row.percent >= 100 ? 'success' : 'warning'}>{formatPercent(row.percent)}</Chip>
                      </div>
                    </div>
                    <div className="mt-3">
                      <ProgressBar percent={row.percent} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <AdminWidgets>
            <Panel eyebrow="Progression" title="Programme completion" icon="📈">
              {model.progression.length === 0 ? (
                <p className="text-sm text-slate-400">No progression data.</p>
              ) : (
                <ul className="space-y-3">
                  {model.progression.map((row) => (
                    <li key={row.programme.id}>
                      <Row>
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{row.programme.title}</span>
                        <span className="ml-auto text-xs text-slate-400">
                          {row.completed}/{row.total} courses · {formatPercent(row.percent)}
                        </span>
                      </Row>
                      <div className="mt-2">
                        <ProgressBar percent={row.percent} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
            <Panel eyebrow="Workflow registry" title="Events by kind" icon="⚙️">
              {model.workflows.length === 0 ? (
                <p className="text-sm text-slate-400">No workflow events recorded yet.</p>
              ) : (
                <ul className="space-y-2">
                  {model.workflows.map((row) => (
                    <Row key={row.kind}>
                      <Chip tone="info" icon={workflowKindIcon(row.kind)}>
                        {workflowKindLabel(row.kind)}
                      </Chip>
                      <span className="ml-auto text-sm font-semibold text-slate-700 dark:text-slate-200">{row.count}</span>
                    </Row>
                  ))}
                </ul>
              )}
            </Panel>
          </AdminWidgets>

          <Panel eyebrow="Approvals" title="Permission decisions" icon="🔎">
            {model.approvals.length === 0 ? (
              <AdminEmptyState title="No checks" description="No permission decisions have been evaluated." />
            ) : (
              <ul className="space-y-3">
                {model.approvals.map((decision, index) => (
                  <Row key={index}>
                    <Chip tone={decision.allowed ? 'success' : 'danger'}>
                      {decision.allowed ? 'Allowed' : 'Denied'}
                    </Chip>
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      {decision.role} · {decision.action} · {decision.resource}
                    </span>
                  </Row>
                ))}
              </ul>
            )}
          </Panel>
        </>
      ) : null}

      {tab === 'curriculum' ? (
        <>
          <CurriculumBuilder />
          <CurriculumViewer />
        </>
      ) : null}

      {tab === 'analytics' ? <ProgrammeAnalytics /> : null}
    </>
  );
}
