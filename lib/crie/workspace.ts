/**
 * Workspace Engine — Mission 004-D (Wave 2).
 *
 * Pure workspace helpers over `Workspace`, `WorkspacePane`, `OpenDocument`,
 * and `SelectedPassage` (CRIE Ch. 7). The workspace is the researcher's
 * persistent research surface: panes, tabs, active documents and passages,
 * open entities, navigation history, pinned entities, bookmarks, and recent
 * activity. All derived views are computed here, never stored.
 */
import type {
  KGEntityClass,
  OpenDocument,
  ResearcherRef,
  SelectedPassage,
  Workspace,
  WorkspacePane,
  WorkspacePaneKind,
} from '@/types/crie';
import { nowIso, slugOf } from './utils';

export function workspaceId(label: string): string {
  return `workspace-${slugOf(label)}`;
}

export interface WorkspaceInput {
  label: string;
  researcher: ResearcherRef;
  panes?: WorkspacePane[];
}

export function createWorkspace(input: WorkspaceInput): Workspace {
  const now = nowIso();
  return {
    id: workspaceId(input.label),
    researcher: { username: input.researcher.username, name: input.researcher.name },
    panes: input.panes ?? [],
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}

export function workspacesFor(
  workspaces: readonly Workspace[],
  username: string,
): Workspace[] {
  return workspaces.filter((workspace) => workspace.researcher.username === username);
}

export function workspacePaneId(label: string): string {
  return `pane-${slugOf(label)}`;
}

export interface WorkspacePaneInput {
  label: string;
  workspaceId: string;
  paneKind: WorkspacePaneKind;
  title: string;
  open?: boolean;
}

export function createPane(input: WorkspacePaneInput): WorkspacePane {
  const now = nowIso();
  return {
    id: workspacePaneId(input.label),
    workspaceId: input.workspaceId,
    paneKind: input.paneKind,
    title: input.title,
    open: input.open ?? true,
    createdAt: now,
    updatedAt: now,
  };
}

export function addPane(workspace: Workspace, pane: WorkspacePane): Workspace {
  const now = nowIso();
  return { ...workspace, panes: [...workspace.panes, pane], updatedAt: now, version: workspace.version + 1 };
}

export function removePane(workspace: Workspace, paneId: string): Workspace {
  const now = nowIso();
  return { ...workspace, panes: workspace.panes.filter((pane) => pane.id !== paneId), updatedAt: now, version: workspace.version + 1 };
}

export function togglePane(workspace: Workspace, paneId: string): Workspace {
  const now = nowIso();
  return {
    ...workspace,
    panes: workspace.panes.map((pane) =>
      pane.id === paneId ? { ...pane, open: !pane.open, updatedAt: now } : pane,
    ),
    updatedAt: now,
    version: workspace.version + 1,
  };
}

export function openPanes(workspace: Workspace): WorkspacePane[] {
  return workspace.panes.filter((pane) => pane.open !== false);
}

export function paneOfKind(
  workspace: Workspace,
  paneKind: WorkspacePaneKind,
): WorkspacePane | undefined {
  return workspace.panes.find((pane) => pane.paneKind === paneKind);
}

export function openDocumentId(label: string): string {
  return `open-doc-${slugOf(label)}`;
}

export interface OpenDocumentInput {
  label: string;
  workspaceId: string;
  documentId: string;
  paneId: string;
  focusState?: string;
}

export function openDocumentRecord(input: OpenDocumentInput): OpenDocument {
  const now = nowIso();
  return {
    id: openDocumentId(input.label),
    workspaceId: input.workspaceId,
    documentId: input.documentId,
    paneId: input.paneId,
    focusState: input.focusState,
    createdAt: now,
    updatedAt: now,
  };
}

export function documentsInWorkspace(
  openDocuments: readonly OpenDocument[],
  workspaceIdValue: string,
): OpenDocument[] {
  return openDocuments.filter((document) => document.workspaceId === workspaceIdValue);
}

export function selectedPassageId(label: string): string {
  return `selection-${slugOf(label)}`;
}

export interface SelectedPassageInput {
  label: string;
  openDocumentId: string;
  chunkId: string;
  startOffset: number;
  endOffset: number;
  note?: string;
}

export function selectedPassageRecord(input: SelectedPassageInput): SelectedPassage {
  const now = nowIso();
  return {
    id: selectedPassageId(input.label),
    openDocumentId: input.openDocumentId,
    chunkId: input.chunkId,
    startOffset: input.startOffset,
    endOffset: input.endOffset,
    note: input.note,
    createdAt: now,
    updatedAt: now,
  };
}

export function passagesForDocument(
  selections: readonly SelectedPassage[],
  openDocumentIdValue: string,
): SelectedPassage[] {
  return selections.filter((selection) => selection.openDocumentId === openDocumentIdValue);
}

// ---------------------------------------------------------------------------
// Navigation history
// ---------------------------------------------------------------------------

export interface WorkspaceNavEntry {
  id: string;
  targetId: string;
  title: string;
  openedAt: string;
}

export function workspaceNavEntry(input: {
  label: string;
  targetId: string;
  title: string;
}): WorkspaceNavEntry {
  return {
    id: `nav-${slugOf(input.label)}`,
    targetId: input.targetId,
    title: input.title,
    openedAt: nowIso(),
  };
}

export function navHistory(entries: readonly WorkspaceNavEntry[]): WorkspaceNavEntry[] {
  return [...entries].sort((a, b) => b.openedAt.localeCompare(a.openedAt));
}

// ---------------------------------------------------------------------------
// Pinned entities
// ---------------------------------------------------------------------------

export interface WorkspacePinnedEntity {
  id: string;
  workspaceId: string;
  entityId: string;
  entityClass: KGEntityClass;
  pinnedAt: string;
}

export function pinEntity(input: {
  label: string;
  workspaceId: string;
  entityId: string;
  entityClass: KGEntityClass;
}): WorkspacePinnedEntity {
  return {
    id: `pin-${slugOf(input.label)}`,
    workspaceId: input.workspaceId,
    entityId: input.entityId,
    entityClass: input.entityClass,
    pinnedAt: nowIso(),
  };
}

export function pinnedEntitiesFor(
  pinned: readonly WorkspacePinnedEntity[],
  workspaceIdValue: string,
): WorkspacePinnedEntity[] {
  return pinned.filter((entry) => entry.workspaceId === workspaceIdValue);
}

export function unpinEntity(
  pinned: readonly WorkspacePinnedEntity[],
  entityId: string,
): WorkspacePinnedEntity[] {
  return pinned.filter((entry) => entry.entityId !== entityId);
}

// ---------------------------------------------------------------------------
// Bookmarks
// ---------------------------------------------------------------------------

export interface WorkspaceBookmark {
  id: string;
  workspaceId: string;
  label: string;
  documentId: string;
  createdAt: string;
}

export function addBookmark(input: {
  label: string;
  workspaceId: string;
  documentId: string;
}): WorkspaceBookmark {
  return {
    id: `bookmark-${slugOf(input.label)}`,
    workspaceId: input.workspaceId,
    label: input.label,
    documentId: input.documentId,
    createdAt: nowIso(),
  };
}

export function bookmarksFor(
  bookmarks: readonly WorkspaceBookmark[],
  workspaceIdValue: string,
): WorkspaceBookmark[] {
  return bookmarks.filter((bookmark) => bookmark.workspaceId === workspaceIdValue);
}

export function removeBookmark(
  bookmarks: readonly WorkspaceBookmark[],
  bookmarkId: string,
): WorkspaceBookmark[] {
  return bookmarks.filter((bookmark) => bookmark.id !== bookmarkId);
}

// ---------------------------------------------------------------------------
// Recent activity
// ---------------------------------------------------------------------------

export interface WorkspaceActivity {
  id: string;
  kind: string;
  title: string;
  occurredAt: string;
}

export function activityEntry(input: { label: string; kind: string; title: string }): WorkspaceActivity {
  return {
    id: `activity-${slugOf(input.label)}`,
    kind: input.kind,
    title: input.title,
    occurredAt: nowIso(),
  };
}

export function recentActivity(
  activities: readonly WorkspaceActivity[],
  limit?: number,
): WorkspaceActivity[] {
  const sorted = [...activities].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  return limit ? sorted.slice(0, limit) : sorted;
}

// ---------------------------------------------------------------------------
// Statistics
// ---------------------------------------------------------------------------

export interface WorkspaceStatistics {
  total: number;
  totalPanes: number;
  openPanes: number;
  byPaneKind: Partial<Record<WorkspacePaneKind, number>>;
}

export function workspaceStatistics(workspaces: readonly Workspace[]): WorkspaceStatistics {
  const byPaneKind: Partial<Record<WorkspacePaneKind, number>> = {};
  let totalPanes = 0;
  let openPaneCount = 0;
  for (const workspace of workspaces) {
    for (const pane of workspace.panes) {
      byPaneKind[pane.paneKind] = (byPaneKind[pane.paneKind] ?? 0) + 1;
      totalPanes += 1;
      if (pane.open !== false) openPaneCount += 1;
    }
  }
  return {
    total: workspaces.length,
    totalPanes,
    openPanes: openPaneCount,
    byPaneKind,
  };
}

export interface WorkspaceOverview {
  panes: WorkspacePane[];
  openDocuments: OpenDocument[];
  selections: SelectedPassage[];
}

export function workspaceOverview(
  workspace: Workspace,
  openDocuments: readonly OpenDocument[],
  selections: readonly SelectedPassage[],
): WorkspaceOverview {
  const documents = documentsInWorkspace(openDocuments, workspace.id);
  return {
    panes: workspace.panes,
    openDocuments: documents,
    selections: selections.filter((selection) =>
      documents.some((document) => document.id === selection.openDocumentId),
    ),
  };
}
