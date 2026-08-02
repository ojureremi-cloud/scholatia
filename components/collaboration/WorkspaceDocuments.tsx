import Badge from '@/components/ui/Badge';
import { formatDate, formatDocumentStatus, formatDocumentStatusIcon, formatDocumentType, formatDocumentTypeIcon } from './format';
import type { CollaborationWorkspace } from '@/types/collaboration';

type WorkspaceDocumentsProps = {
  workspace: CollaborationWorkspace;
};

export function WorkspaceDocuments({ workspace }: WorkspaceDocumentsProps) {
  if (workspace.documents.length === 0) {
    return <p className="text-sm text-slate-400">No documents in this workspace yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {workspace.documents.map((document) => (
        <li
          key={document.id}
          className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg">{formatDocumentTypeIcon(document.type)}</span>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{document.title}</p>
            <Badge variant="default">{formatDocumentType(document.type)}</Badge>
            <Badge variant={document.status === 'published' ? 'success' : document.status === 'in-review' ? 'warning' : 'default'}>
              {formatDocumentStatusIcon(document.status)} {formatDocumentStatus(document.status)}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            v{document.version} · {document.authorName ?? document.author} · updated {formatDate(document.updatedAt)}
          </p>
        </li>
      ))}
    </ul>
  );
}
