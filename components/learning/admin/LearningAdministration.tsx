'use client';

import { useState } from 'react';
import StatisticCard from '@/components/ui/StatisticCard';
import useLearning from '@/hooks/useLearning';
import {
  actionLabel,
  formatDate,
  notificationKindIcon,
  notificationKindLabel,
  resourceKindLabel,
  roleIcon,
  roleLabel,
  roleVariant,
  workflowKindIcon,
  workflowKindLabel,
} from '../format';
import { Chip, Panel, Row } from '../primitives';
import { AdminEmptyState } from './AdminEmptyState';
import { AdminFilters } from './AdminFilters';
import { AdminHeader } from './AdminHeader';
import { AdminWidgets } from './AdminWidgets';

type AdminTab = 'overview' | 'permissions' | 'assignments' | 'workflows' | 'validation' | 'notifications';

export function LearningAdministration() {
  const { administration, workflowRegistry, notificationRegistry, validationRegistry, permissionsOf, assignmentsOf } =
    useLearning();
  const model = administration();
  const [tab, setTab] = useState<AdminTab>('overview');

  const errorCount = model.validation.reduce((sum, entry) => sum + entry.report.errorCount, 0);
  const warningCount = model.validation.reduce((sum, entry) => sum + entry.report.warningCount, 0);

  return (
    <>
      <AdminHeader
        eyebrow="Platform administration"
        title="Learning Administration"
        description="Role-based access control, workflow registry, validation registry, notifications, and governance oversight."
        icon="🛡️"
      />

      <AdminWidgets>
        <StatisticCard icon="🧑‍💼" title="Roles" value={String(model.roles.length)} />
        <StatisticCard icon="🔐" title="Grants" value={String(model.grants.length)} />
        <StatisticCard icon="✅" title="Valid targets" value={String(model.validation.filter((entry) => entry.report.valid).length)} trend={`${errorCount} errors · ${warningCount} warnings`} trendPositive={errorCount === 0} />
        <StatisticCard icon="🔔" title="Notification kinds" value={String(model.notifications.length)} />
      </AdminWidgets>

      <AdminFilters<AdminTab>
        options={[
          { label: 'Overview', value: 'overview' },
          { label: 'Permissions', value: 'permissions' },
          { label: 'Assignments', value: 'assignments' },
          { label: 'Workflows', value: 'workflows' },
          { label: 'Validation', value: 'validation' },
          { label: 'Notifications', value: 'notifications' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'overview' ? (
        <Panel eyebrow="Access control" title="Role grants" icon="🔐">
          {model.roles.length === 0 ? (
            <AdminEmptyState title="No roles" description="The permission matrix is empty." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {model.roles.map((entry) => (
                <div key={entry.role} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                  <div className="flex items-center justify-between gap-2">
                    <Chip tone={roleVariant(entry.role)} icon={roleIcon(entry.role)}>
                      {entry.label}
                    </Chip>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{entry.grants} grants</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">{permissionsOf(entry.role).length} resource grants configured</p>
                </div>
              ))}
            </div>
          )}
        </Panel>
      ) : null}

      {tab === 'permissions' ? (
        <Panel eyebrow="Permission matrix" title="Role → resource → actions" icon="🔐">
          {model.matrix.length === 0 ? (
            <AdminEmptyState title="No grants" description="No permission grants are configured." />
          ) : (
            <ul className="space-y-3">
              {model.matrix.map((grant) => (
                <li key={`${grant.role}-${grant.resource}`} className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                  <Row>
                    <Chip tone={roleVariant(grant.role)} icon={roleIcon(grant.role)}>
                      {roleLabel(grant.role)}
                    </Chip>
                    <Chip tone="default">{resourceKindLabel(grant.resource)}</Chip>
                    <span className="flex flex-wrap gap-1.5">
                      {grant.actions.map((action) => (
                        <Chip key={action} tone="info">
                          {actionLabel(action)}
                        </Chip>
                      ))}
                    </span>
                  </Row>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      ) : null}

      {tab === 'assignments' ? (
        <Panel eyebrow="Role assignments" title="Canonical researcher scoping" icon="🧑‍💼">
          {model.assignments.length === 0 ? (
            <AdminEmptyState title="No assignments" description="No roles have been assigned." />
          ) : (
            <ul className="space-y-2">
              {model.assignments.map((assignment) => (
                <li key={assignment.id} className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                  <Row>
                    <Chip tone="info">@{assignment.username}</Chip>
                    <Chip tone={roleVariant(assignment.role)} icon={roleIcon(assignment.role)}>
                      {roleLabel(assignment.role)}
                    </Chip>
                    <span className="text-xs text-slate-400">
                      {assignment.scopeType ? `${assignment.scopeType}: ${assignment.scopeId ?? 'global'}` : 'platform'} · granted{' '}
                      {formatDate(assignment.grantedAt)}
                    </span>
                    <span className="ml-auto text-xs text-slate-400">{assignmentsOf(assignment.username).length} roles for user</span>
                  </Row>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      ) : null}

      {tab === 'workflows' ? (
        <Panel eyebrow="Workflow registry" title="Orchestration events" icon="⚙️">
          {model.workflows.length === 0 ? (
            <AdminEmptyState title="No workflow events" description="Workflow events will appear here." />
          ) : (
            <ul className="space-y-2">
              {workflowRegistry().map((row) => (
                <Row key={row.kind} className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                  <Chip tone="info" icon={workflowKindIcon(row.kind)}>
                    {workflowKindLabel(row.kind)}
                  </Chip>
                  <span className="ml-auto text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {row.count} of {row.total}
                  </span>
                </Row>
              ))}
            </ul>
          )}
        </Panel>
      ) : null}

      {tab === 'validation' ? (
        <Panel eyebrow="Validation registry" title="Engine findings" icon="✅">
          {model.validation.length === 0 ? (
            <AdminEmptyState title="No validation targets" description="No resources have been validated." />
          ) : (
            <ul className="space-y-3">
              {validationRegistry().map((entry) => (
                <li key={entry.target} className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700">
                  <Row>
                    <Chip tone={entry.report.valid ? 'success' : 'danger'}>{entry.report.valid ? 'Valid' : 'Findings'}</Chip>
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-700 dark:text-slate-200">{entry.target}</span>
                    <span className="text-xs text-slate-400">
                      {entry.report.errorCount} errors · {entry.report.warningCount} warnings · {entry.report.issues.length} issues
                    </span>
                  </Row>
                  {entry.report.issues.length > 0 ? (
                    <ul className="mt-2 space-y-1">
                      {entry.report.issues.map((issue, index) => (
                        <li key={index} className="text-xs text-slate-500 dark:text-slate-400">
                          <Chip tone={issue.severity === 'error' ? 'danger' : issue.severity === 'warning' ? 'warning' : 'default'}>
                            {issue.severity}
                          </Chip>{' '}
                          {issue.message}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </Panel>
      ) : null}

      {tab === 'notifications' ? (
        <Panel eyebrow="Notification registry" title="Kinds and priorities" icon="🔔">
          {model.notifications.length === 0 ? (
            <AdminEmptyState title="No notifications" description="Notification kinds will appear here." />
          ) : (
            <ul className="space-y-2">
              {notificationRegistry().map((row) => (
                <Row key={row.kind} className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                  <Chip tone="info" icon={notificationKindIcon(row.kind)}>
                    {notificationKindLabel(row.kind)}
                  </Chip>
                  <Chip tone={row.priority === 'high' || row.priority === 'urgent' ? 'danger' : row.priority === 'normal' ? 'warning' : 'default'}>
                    {row.priority}
                  </Chip>
                  <span className="ml-auto text-sm font-semibold text-slate-700 dark:text-slate-200">{row.count} events</span>
                </Row>
              ))}
            </ul>
          )}
        </Panel>
      ) : null}
    </>
  );
}
