'use client';

import { useState } from 'react';
import StatisticCard from '@/components/ui/StatisticCard';
import useLearning from '@/hooks/useLearning';
import { domainIcon, domainLabel, domainVariant, formatPercent, levelName } from '../format';
import { ProgressBar } from '../ProgressBar';
import { Chip, Panel } from '../primitives';
import { AdminEmptyState } from './AdminEmptyState';
import { AdminFilters } from './AdminFilters';
import { AdminHeader } from './AdminHeader';
import { AdminWidgets } from './AdminWidgets';
import { CompetencyStatistics } from './CompetencyStatistics';

type CompetencyTab = 'framework' | 'attainment';

export function CompetencyManager() {
  const { curriculum, competencyRadar } = useLearning();
  const model = curriculum();
  const radar = competencyRadar();
  const [tab, setTab] = useState<CompetencyTab>('framework');

  return (
    <>
      <AdminHeader
        eyebrow="Academic operations"
        title="Competency Manager"
        description="The Scholarly Learning Competency Framework — domains, skills, knowledge areas, and learner attainment."
        icon="🧩"
      />

      <AdminWidgets>
        <StatisticCard icon="🧩" title="Competencies" value={String(model.competencies.length)} />
        <StatisticCard icon="🛠️" title="Skills" value={String(model.skills.length)} />
        <StatisticCard icon="📚" title="Knowledge areas" value={String(model.knowledgeAreas.length)} />
        <StatisticCard icon="🎯" title="Attainment" value={formatPercent(radar.attainment)} trend="Learner competency attainment" trendPositive />
      </AdminWidgets>

      <AdminFilters<CompetencyTab>
        options={[
          { label: 'Framework', value: 'framework' },
          { label: 'Attainment', value: 'attainment' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'framework' ? (
        <Panel eyebrow="Framework" title="Competency catalogue" icon="🧩">
          {model.competencies.length === 0 ? (
            <AdminEmptyState title="No competencies" description="The framework is empty." />
          ) : (
            <ul className="space-y-4">
              {model.competencies.map((competency) => (
                <li key={competency.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{competency.name}</p>
                      <p className="mt-1 text-xs text-slate-400">{competency.description}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Chip tone="default" icon={domainIcon(competency.domain)}>
                        {domainLabel(competency.domain)}
                      </Chip>
                      <Chip tone={domainVariant(competency.domain)}>Target {levelName(competency.targetLevel)}</Chip>
                    </div>
                  </div>
                  {competency.skills.length > 0 || competency.knowledgeAreas.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {competency.skills.map((skill) => (
                        <Chip key={skill} tone="info">
                          🛠️ {skill}
                        </Chip>
                      ))}
                      {competency.knowledgeAreas.map((area) => (
                        <Chip key={area} tone="warning">
                          📚 {area}
                        </Chip>
                      ))}
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </Panel>
      ) : null}

      {tab === 'attainment' ? (
        <>
          <CompetencyStatistics />
          <Panel eyebrow="Learner radar" title="Current vs target levels" icon="📡">
            {radar.competencies.length === 0 ? (
              <AdminEmptyState title="No attainment data" description="Competency evidence will appear here." />
            ) : (
              <ul className="space-y-4">
                {radar.competencies.map((entry) => (
                  <li key={entry.key}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {domainIcon(entry.domain)} {entry.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>Level {entry.currentLevel}</span>
                        <span className="text-slate-300 dark:text-slate-600">→</span>
                        <span>Target {entry.targetLevel}</span>
                        <Chip tone={entry.gap <= 0 ? 'success' : entry.gap < 2 ? 'warning' : 'danger'}>
                          {entry.gap <= 0 ? 'at par' : `${entry.gap} gap`}
                        </Chip>
                      </div>
                    </div>
                    <div className="mt-2">
                      <ProgressBar percent={Math.round((entry.currentLevel / Math.max(1, entry.targetLevel)) * 100)} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </>
      ) : null}
    </>
  );
}
