import type { OpenDocument, SelectedPassage } from '@/types/crie';
import { Panel } from '../primitives';
import { formatRelative } from '../format';

type OpenDocumentsProps = {
  documents: OpenDocument[];
  passages?: SelectedPassage[];
};

export function OpenDocuments({ documents, passages = [] }: OpenDocumentsProps) {
  return (
    <Panel eyebrow="Workspace" title="Open documents" icon="📑">
      {documents.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
          No documents open in the workspace yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {documents.map((document) => {
            const selection = passages.find((passage) => passage.openDocumentId === document.id);
            return (
              <li key={document.id} className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{document.documentId}</p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      pane {document.paneId} · {document.focusState ?? 'default focus'} · opened {formatRelative(document.createdAt)}
                    </p>
                  </div>
                  <span className="shrink-0 text-lg" aria-hidden="true">📄</span>
                </div>
                {selection ? (
                  <p className="mt-2 rounded-xl bg-white px-3 py-2 text-xs leading-5 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                    Selection chunk {selection.chunkId} (chars {selection.startOffset}–{selection.endOffset})
                    {selection.note ? <span className="italic"> — “{selection.note}”</span> : null}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
