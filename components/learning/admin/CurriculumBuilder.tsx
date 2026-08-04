'use client';

import useLearning from '@/hooks/useLearning';
import { formatPercent, nodeTypeIcon } from '../format';
import { ProgressBar } from '../ProgressBar';
import { Chip, Panel, Row } from '../primitives';
import { AdminEmptyState } from './AdminEmptyState';
import { AdminWidgets } from './AdminWidgets';

export function CurriculumBuilder() {
  const { curriculum } = useLearning();
  const model = curriculum();

  return (
    <>
      <AdminWidgets>
        <Panel eyebrow="Curriculum builder" title="Programme curricula" icon="🧩">
          {model.curricula.length === 0 ? (
            <AdminEmptyState title="No curricula" description="Add a curriculum to a programme to begin building." />
          ) : (
            <ul className="space-y-4">
              {model.curricula.map((row) => (
                <li key={row.curriculum.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{row.curriculum.title}</p>
                      <p className="text-xs text-slate-400">{row.programme.title}</p>
                    </div>
                    <Chip tone={row.completion >= 100 ? 'success' : 'info'}>{formatPercent(row.completion)}</Chip>
                  </div>
                  <div className="mt-3">
                    <ProgressBar percent={row.completion} />
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    {row.courses.length} courses · {row.completedNodes}/{row.totalNodes} nodes complete
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel eyebrow="Placement map" title="Courses across curricula" icon="🗺️">
          {model.courseMap.length === 0 ? (
            <AdminEmptyState title="No placements" description="Course placements will appear here." />
          ) : (
            <ul className="space-y-3">
              {model.courseMap.map((row) => (
                <li key={row.course.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{row.course.title}</p>
                  {row.placements.length === 0 ? (
                    <p className="mt-1 text-xs text-slate-400">Not placed in any curriculum.</p>
                  ) : (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {row.placements.map((placement) => (
                        <Chip key={`${placement.programme}-${placement.curriculum}`} tone="default">
                          {placement.curriculum}
                        </Chip>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </AdminWidgets>

      <AdminWidgets>
        <Panel eyebrow="Skills" title="Framework skills" icon="🛠️">
          {model.skills.length === 0 ? (
            <p className="text-sm text-slate-400">No skills referenced.</p>
          ) : (
            <ul className="space-y-2">
              {model.skills.map((skill) => (
                <Row key={skill.id}>
                  <span aria-hidden="true">{nodeTypeIcon('topic')}</span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{skill.name}</span>
                </Row>
              ))}
            </ul>
          )}
        </Panel>
        <Panel eyebrow="Knowledge" title="Framework knowledge areas" icon="📚">
          {model.knowledgeAreas.length === 0 ? (
            <p className="text-sm text-slate-400">No knowledge areas referenced.</p>
          ) : (
            <ul className="space-y-2">
              {model.knowledgeAreas.map((area) => (
                <Row key={area.id}>
                  <span aria-hidden="true">{nodeTypeIcon('lesson')}</span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{area.name}</span>
                </Row>
              ))}
            </ul>
          )}
        </Panel>
      </AdminWidgets>
    </>
  );
}
