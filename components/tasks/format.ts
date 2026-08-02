import {
  TASK_PRIORITY_ICONS,
  TASK_PRIORITY_LABELS,
  TASK_STATUS_ICONS,
  TASK_STATUS_LABELS,
} from '@/types/tasks';
import type { TaskPriority, TaskStatus } from '@/types/tasks';

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

export function formatTaskStatus(status: TaskStatus): string {
  return TASK_STATUS_LABELS[status] ?? status;
}

export function formatTaskStatusIcon(status: TaskStatus): string {
  return TASK_STATUS_ICONS[status] ?? '📋';
}

export function taskStatusVariant(status: TaskStatus): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case 'done':
      return 'success';
    case 'in-progress':
      return 'info';
    case 'in-review':
      return 'warning';
    case 'blocked':
      return 'danger';
    default:
      return 'default';
  }
}

export function formatTaskPriority(priority: TaskPriority): string {
  return TASK_PRIORITY_LABELS[priority] ?? priority;
}

export function formatTaskPriorityIcon(priority: TaskPriority): string {
  return TASK_PRIORITY_ICONS[priority] ?? '➖';
}

export function taskPriorityVariant(priority: TaskPriority): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (priority) {
    case 'low':
      return 'default';
    case 'medium':
      return 'info';
    case 'high':
      return 'warning';
    case 'urgent':
      return 'danger';
    default:
      return 'default';
  }
}
