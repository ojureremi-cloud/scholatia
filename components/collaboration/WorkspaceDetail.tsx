'use client';

import { useMemo, useState } from 'react';
import Badge from '@/components/ui/Badge';
import useCollaboration from '@/hooks/useCollaboration';
import { WorkspaceBadge } from './WorkspaceBadge';
import { WorkspaceDiscussions } from './WorkspaceDiscussions';
import { WorkspaceDocuments } from './WorkspaceDocuments';
import { WorkspaceInvitations } from './WorkspaceInvitations';
import { WorkspaceMeetings } from './WorkspaceMeetings';
import { WorkspaceMembers } from './WorkspaceMembers';
import { WorkspaceMilestones } from './WorkspaceMilestones';
import { WorkspaceStatusBadge } from './WorkspaceStatusBadge';
import { WorkspaceTasks } from './WorkspaceTasks';
import { WorkspaceVisibilityBadge } from './WorkspaceVisibilityBadge';
import { formatKindIcon, formatNumber, formatPercent, formatRole } from './format';
import { milestoneProgress, taskProgress } from '@/lib/collaboration';
import type { CollaborationWorkspace } from '@/types/collaboration';

type TabId = 'members' | 'tasks' | 'documents' | 'meetings' | 'milestones' | 'discussions' | 'invitations';

type WorkspaceDetailProps = {
  workspace: CollaborationWorkspace;
};

export function WorkspaceDetail({ workspace }: WorkspaceDetailProps) {
  const collaboration = useCollaboration();
  const [activeTab, setActiveTab] = useState<TabId>('tasks');

  const canEdit = collaboration.canEdit(workspace);
  const role = collaboration.roleOf(workspace.id);
  const taskProgressValue = useMemo(() => taskProgress(workspace), [workspace]);
  const milestoneProgressValue = useMemo(() => milestoneProgress(workspace), [workspace]);

  const tabs: { id: TabId; label: string; count: number }[] = [
    { id: 'members', label: 'Members', count: workspace.members.length },
    { id: 'tasks', label: 'Tasks', count: workspace.tasks.length },
    { id: 'documents', label: 'Documents', count: workspace.documents.length },
    { id: 'meetings', label: 'Meetings', count: workspace.meetings.length },
    { id: 'milestones', label: 'Milestones', count: workspace.milestones.length },
    { id: 'discussions', label: 'Discussions', count: workspace.discussions.length },
    { id: 'invitations', label: 'Invitations', count: workspace.invitations.length },
  ];

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-2xl dark:bg-slate-800">
          {formatKindIcon(workspace.kind)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{workspace.name}</h3>
            <WorkspaceStatusBadge status={workspace.status} />
          </div>
          <p className="text-xs text-slate-400">
            owned by {workspace.ownerName ?? workspace.owner}
            {role ? ` · your role: ${formatRole(role)}` : ''}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <WorkspaceBadge kind={workspace.kind} />
        <WorkspaceVisibilityBadge visibility={workspace.visibility} />
        {workspace.sourceTitle && <Badge variant="info">🗂️ {workspace.sourceTitle}</Badge>}
      </div>

      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{workspace.description}</p>

      {workspace.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {workspace.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-600 dark:bg-sky-900 dark:text-sky-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Task progress</span>
            <span>{formatPercent(taskProgressValue)}</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full rounded-full bg-sky-500" style={{ width: `${Math.round(taskProgressValue * 100)}%` }} />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Milestone progress</span>
            <span>{formatPercent(milestoneProgressValue)}</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${Math.round(milestoneProgressValue * 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 rounded-3xl bg-slate-100 p-2 dark:bg-slate-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={[
              'rounded-3xl px-4 py-2 text-sm font-semibold transition',
              activeTab === tab.id
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-slate-100'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {tab.label} ({formatNumber(tab.count)})
          </button>
        ))}
      </div>

      <div className="mt-4">
        {activeTab === 'members' && <WorkspaceMembers workspace={workspace} />}
        {activeTab === 'tasks' && (
          <WorkspaceTasks workspace={workspace} canEdit={canEdit} onStatusChange={(taskIdValue, status) => collaboration.setTaskStatus(workspace.id, taskIdValue, status)} />
        )}
        {activeTab === 'documents' && <WorkspaceDocuments workspace={workspace} />}
        {activeTab === 'meetings' && <WorkspaceMeetings workspace={workspace} />}
        {activeTab === 'milestones' && <WorkspaceMilestones workspace={workspace} />}
        {activeTab === 'discussions' && <WorkspaceDiscussions workspace={workspace} />}
        {activeTab === 'invitations' && <WorkspaceInvitations workspace={workspace} />}
      </div>
    </div>
  );
}
