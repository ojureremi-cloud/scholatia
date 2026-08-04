'use client';

import { useState } from 'react';
import StatisticCard from '@/components/ui/StatisticCard';
import useLearning from '@/hooks/useLearning';
import {
  academyKindIcon,
  academyKindLabel,
  eventKindIcon,
  eventKindLabel,
  eventModeLabel,
  formatDate,
} from '../format';
import { Chip, Panel, Row } from '../primitives';
import { AdminEmptyState } from './AdminEmptyState';
import { AdminFilters } from './AdminFilters';
import { AdminHeader } from './AdminHeader';
import { AdminWidgets } from './AdminWidgets';
import { AcademyAnalytics } from './AcademyAnalytics';

type AcademyTab = 'overview' | 'analytics';

export function AcademyDashboard() {
  const { academy, academyEventsOf, academyMembersOf } = useLearning();
  const model = academy();
  const [tab, setTab] = useState<AcademyTab>('overview');
  const [selectedId, setSelectedId] = useState<string | undefined>(model.academies[0]?.academy.id);

  const selected = model.academies.find((row) => row.academy.id === selectedId);

  return (
    <>
      <AdminHeader
        eyebrow="Academic operations"
        title="Academy Dashboard"
        description="Scholarly academies, their membership, events, and registration activity across the ecosystem."
        icon="🏫"
      />

      <AdminWidgets>
        <StatisticCard icon="🏫" title="Academies" value={String(model.academies.length)} />
        <StatisticCard icon="👥" title="Members" value={String(model.academies.reduce((sum, row) => sum + row.memberCount, 0))} />
        <StatisticCard icon="📅" title="Events" value={String(model.academies.reduce((sum, row) => sum + row.eventCount, 0))} />
        <StatisticCard icon="🎟️" title="Registrations" value={String(model.academies.reduce((sum, row) => sum + row.registrations, 0))} />
      </AdminWidgets>

      <AdminFilters<AcademyTab>
        options={[
          { label: 'Overview', value: 'overview' },
          { label: 'Analytics', value: 'analytics' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'overview' ? (
        <Panel eyebrow="Academies" title="Learning academies" icon="🏫">
          {model.academies.length === 0 ? (
            <AdminEmptyState title="No academies" description="No academies are registered." />
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {model.academies.map((row) => (
                  <button
                    key={row.academy.id}
                    type="button"
                    onClick={() => setSelectedId(row.academy.id)}
                    className={[
                      'rounded-full px-4 py-2 text-xs font-semibold transition',
                      row.academy.id === selectedId
                        ? 'bg-sky-600 text-white'
                        : 'border border-slate-200 bg-white text-slate-600 hover:border-sky-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {row.academy.name}
                  </button>
                ))}
              </div>

              {selected ? (
                <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{selected.academy.name}</p>
                      <p className="mt-1 text-xs text-slate-400">{selected.academy.description}</p>
                    </div>
                    <Chip tone="warning" icon={academyKindIcon(selected.kind)}>
                      {academyKindLabel(selected.kind)}
                    </Chip>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400">Members</p>
                      <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{selected.memberCount}</p>
                      {selected.members.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {selected.members.map((member) => (
                            <Chip key={member} tone="info">
                              @{member}
                            </Chip>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400">Events</p>
                      <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{selected.eventCount}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400">Registrations</p>
                      <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{selected.registrations}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs uppercase tracking-wider text-slate-400">Upcoming sessions</p>
                    {academyEventsOf(selected.academy.id).length === 0 ? (
                      <p className="mt-2 text-sm text-slate-400">No events for this academy.</p>
                    ) : (
                      <ul className="mt-2 space-y-2">
                        {academyEventsOf(selected.academy.id).map((eventEntry) => (
                          <li key={eventEntry.id} className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                            <Row>
                              <Chip tone="default" icon={eventKindIcon(eventEntry.kind)}>
                                {eventKindLabel(eventEntry.kind)}
                              </Chip>
                              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-700 dark:text-slate-200">
                                {eventEntry.title}
                              </span>
                              <span className="text-xs text-slate-400">
                                {formatDate(eventEntry.startAt)} · {eventModeLabel(eventEntry.mode)}
                              </span>
                            </Row>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ) : null}

              <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                <span>Membership lookup via academy registry: {academyMembersOf(selected?.academy.id ?? '').length} members resolved.</span>
              </div>
            </div>
          )}
        </Panel>
      ) : null}

      {tab === 'analytics' ? <AcademyAnalytics /> : null}
    </>
  );
}
