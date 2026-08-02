import {
  ARTEFACT_TYPE_ICONS,
  ARTEFACT_TYPE_LABELS,
  WORKBENCH_ITEM_TYPE_ICONS,
  WORKBENCH_ITEM_TYPE_LABELS,
} from '@/types/workflows';
import type { ScholarlyArtefactType, WorkbenchItemStatus, WorkbenchItemType } from '@/types/workflows';

export function formatDate(iso: string | undefined): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatRelative(iso: string | undefined, now = new Date()): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const diffMs = now.getTime() - date.getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.round(days / 7)}w ago`;
  return formatDate(iso);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatWorkbenchItemType(type: WorkbenchItemType): string {
  return WORKBENCH_ITEM_TYPE_LABELS[type] ?? type;
}

export function workbenchItemTypeIcon(type: WorkbenchItemType): string {
  return WORKBENCH_ITEM_TYPE_ICONS[type] ?? '📦';
}

export function workbenchItemStatusVariant(status: WorkbenchItemStatus): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case 'promoted':
      return 'success';
    case 'active':
      return 'info';
    case 'archived':
      return 'default';
    default:
      return 'default';
  }
}

export function formatWorkbenchItemStatus(status: WorkbenchItemStatus): string {
  switch (status) {
    case 'promoted':
      return 'Promoted';
    case 'active':
      return 'Active';
    case 'archived':
      return 'Archived';
    default:
      return 'Draft';
  }
}

export function formatArtefactType(type: ScholarlyArtefactType): string {
  return ARTEFACT_TYPE_LABELS[type] ?? type;
}

export function artefactTypeIcon(type: ScholarlyArtefactType): string {
  return ARTEFACT_TYPE_ICONS[type] ?? '📄';
}
