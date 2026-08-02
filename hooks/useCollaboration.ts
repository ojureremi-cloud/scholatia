'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  COLLABORATION_ANALYTICS,
  COLLABORATION_PORTFOLIO,
  COLLABORATION_STATISTICS,
  CURRENT_COLLABORATION_USER,
  FEATURED_WORKSPACES,
  INSIGHTS,
  WORKSPACES,
} from '@/constants/placeholder-collaboration';
import {
  addMember,
  canEditWorkspace,
  canManageWorkspace,
  canViewWorkspace,
  changeMemberRole,
  createTask,
  createWorkspace,
  filterWorkspaces,
  memberRoleOf,
  removeMember,
  searchWorkspaces,
  sortWorkspaces,
  taskId,
  updateTaskStatus,
  workspaceId,
  workspacesForUser,
} from '@/lib/collaboration';
import type {
  CollaborationFilter,
  CollaborationMemberRole,
  CollaborationSort,
  CollaborationTaskPriority,
  CollaborationTaskStatus,
  CollaborationWorkspace,
  CollaborationWorkspaceKind,
  CollaborationWorkspaceStatus,
  CollaborationWorkspaceVisibility,
} from '@/types/collaboration';

const CURRENT_USER_NAME = 'Dr. Adebisi Ojurere';

export default function useCollaboration() {
  const [workspaces, setWorkspaces] = useState(WORKSPACES);
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<'all' | CollaborationWorkspaceKind>('all');
  const [visibility, setVisibility] = useState<'all' | CollaborationWorkspaceVisibility>('all');
  const [status, setStatus] = useState<'all' | CollaborationWorkspaceStatus>('all');
  const [sort, setSort] = useState<CollaborationSort>('recent');

  const viewer = useMemo(() => ({ username: CURRENT_COLLABORATION_USER, name: CURRENT_USER_NAME }), []);

  const visible = useMemo(
    () => workspaces.filter((workspace) => canViewWorkspace(workspace, viewer.username)),
    [workspaces, viewer],
  );

  const filtered = useMemo(() => {
    const filter: CollaborationFilter = {
      kind: kind === 'all' ? undefined : kind,
      visibility: visibility === 'all' ? undefined : visibility,
      status: status === 'all' ? undefined : status,
    };
    return sortWorkspaces(filterWorkspaces(visible, filter), sort);
  }, [visible, kind, visibility, status, sort]);

  const searchResults = useMemo(() => (query.trim() ? searchWorkspaces(visible, query) : []), [query, visible]);

  const myWorkspaces = useMemo(() => workspacesForUser(visible, viewer.username), [visible, viewer]);

  const portfolio = useMemo(() => COLLABORATION_PORTFOLIO, []);
  const statistics = useMemo(() => COLLABORATION_STATISTICS, []);
  const analytics = useMemo(() => COLLABORATION_ANALYTICS, []);
  const insights = useMemo(() => INSIGHTS, []);
  const featured = useMemo(() => FEATURED_WORKSPACES, []);

  const roleOf = useCallback(
    (workspaceIdValue: string): CollaborationMemberRole | undefined => {
      const workspace = visible.find((entry) => entry.id === workspaceIdValue);
      return workspace ? memberRoleOf(workspace, viewer.username) : undefined;
    },
    [visible, viewer],
  );

  const isMember = useCallback(
    (workspace: CollaborationWorkspace) => memberRoleOf(workspace, viewer.username) !== undefined,
    [viewer],
  );

  const canEdit = useCallback(
    (workspace: CollaborationWorkspace) => canEditWorkspace(workspace, viewer.username),
    [viewer],
  );

  const canManage = useCallback(
    (workspace: CollaborationWorkspace) => canManageWorkspace(workspace, viewer.username),
    [viewer],
  );

  const setTaskStatus = useCallback(
    (workspaceIdValue: string, taskIdValue: string, taskStatus: CollaborationTaskStatus) => {
      setWorkspaces((current) =>
        current.map((workspace) =>
          workspace.id === workspaceIdValue ? updateTaskStatus(workspace, taskIdValue, taskStatus) : workspace,
        ),
      );
    },
    [],
  );

  const addTaskTo = useCallback(
    (
      workspaceIdValue: string,
      title: string,
      options: { priority?: CollaborationTaskPriority; assignee?: string; assigneeName?: string; dueDate?: string } = {},
    ) => {
      setWorkspaces((current) =>
        current.map((workspace) =>
          workspace.id === workspaceIdValue
            ? createTask(workspace, {
                id: taskId(title),
                title,
                priority: options.priority,
                assignee: options.assignee,
                assigneeName: options.assigneeName,
                dueDate: options.dueDate,
                createdBy: viewer.username,
              })
            : workspace,
        ),
      );
    },
    [viewer],
  );

  const inviteMemberTo = useCallback(
    (workspaceIdValue: string, username: string, name: string, role: CollaborationMemberRole) => {
      setWorkspaces((current) =>
        current.map((workspace) =>
          workspace.id === workspaceIdValue ? addMember(workspace, { username, name, role }) : workspace,
        ),
      );
    },
    [],
  );

  const ejectMemberFrom = useCallback((workspaceIdValue: string, username: string) => {
    setWorkspaces((current) =>
      current.map((workspace) => (workspace.id === workspaceIdValue ? removeMember(workspace, username) : workspace)),
    );
  }, []);

  const changeRoleOfMember = useCallback((workspaceIdValue: string, username: string, role: CollaborationMemberRole) => {
    setWorkspaces((current) =>
      current.map((workspace) =>
        workspace.id === workspaceIdValue ? changeMemberRole(workspace, username, role) : workspace,
      ),
    );
  }, []);

  const createNewWorkspace = useCallback(
    (input: {
      name: string;
      kind: CollaborationWorkspaceKind;
      description?: string;
      visibility?: CollaborationWorkspaceVisibility;
      tags?: string[];
    }) => {
      const created = createWorkspace({
        id: workspaceId(input.name),
        name: input.name,
        kind: input.kind,
        description: input.description,
        visibility: input.visibility,
        owner: viewer.username,
        ownerName: viewer.name,
        tags: input.tags,
      });
      setWorkspaces((current) => [created, ...current]);
    },
    [viewer],
  );

  return useMemo(
    () => ({
      workspaces,
      visible,
      filtered,
      searchResults,
      myWorkspaces,
      statistics,
      analytics,
      insights,
      featured,
      portfolio,
      query,
      setQuery,
      kind,
      setKind,
      visibility,
      setVisibility,
      status,
      setStatus,
      sort,
      setSort,
      currentUser: CURRENT_COLLABORATION_USER,
      currentUserName: CURRENT_USER_NAME,
      roleOf,
      isMember,
      canEdit,
      canManage,
      setTaskStatus,
      addTaskTo,
      inviteMemberTo,
      ejectMemberFrom,
      changeRoleOfMember,
      createNewWorkspace,
    }),
    [
      workspaces,
      visible,
      filtered,
      searchResults,
      myWorkspaces,
      statistics,
      analytics,
      insights,
      featured,
      portfolio,
      query,
      kind,
      visibility,
      status,
      sort,
      roleOf,
      isMember,
      canEdit,
      canManage,
      setTaskStatus,
      addTaskTo,
      inviteMemberTo,
      ejectMemberFrom,
      changeRoleOfMember,
      createNewWorkspace,
    ],
  );
}
