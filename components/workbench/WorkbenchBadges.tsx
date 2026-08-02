import { Badge } from '@/components/ui';
import type { ScholarlyArtefactStatus, WorkbenchItemStatus } from '@/types/workflows';
import { formatWorkbenchItemStatus, workbenchItemStatusVariant } from './format';

type WorkbenchItemStatusBadgeProps = {
  status: WorkbenchItemStatus;
};

export function WorkbenchItemStatusBadge({ status }: WorkbenchItemStatusBadgeProps) {
  return <Badge variant={workbenchItemStatusVariant(status)}>{formatWorkbenchItemStatus(status)}</Badge>;
}

export function artefactStatusVariant(status: ScholarlyArtefactStatus): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case 'published':
    case 'approved':
      return 'success';
    case 'under-review':
    case 'in-progress':
      return 'info';
    case 'archived':
      return 'default';
    default:
      return 'default';
  }
}

export function formatArtefactStatus(status: ScholarlyArtefactStatus): string {
  switch (status) {
    case 'published':
      return 'Published';
    case 'approved':
      return 'Approved';
    case 'under-review':
      return 'Under Review';
    case 'in-progress':
      return 'In Progress';
    case 'archived':
      return 'Archived';
    default:
      return 'Draft';
  }
}

type ArtefactStatusBadgeProps = {
  status: ScholarlyArtefactStatus;
};

export function ArtefactStatusBadge({ status }: ArtefactStatusBadgeProps) {
  return <Badge variant={artefactStatusVariant(status)}>{formatArtefactStatus(status)}</Badge>;
}
