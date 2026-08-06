import {
  CRIE_CITATION_CONTEXTS,
  CRIE_CITATION_STATISTICS,
  CRIE_CITATIONS,
  CRIE_REFERENCE_1,
  CRIE_REFERENCE_2,
} from '@/constants/placeholder-crie';
import { renderCitation } from '@/lib/crie/citation';
import { CRIEStats } from '../core';
import type { CRIEStat } from '../core';
import { Chip, Panel, Stack } from '../primitives';
import { formatNumber, confidenceTone, formatPercent } from '../format';

const REFERENCES = [CRIE_REFERENCE_1, CRIE_REFERENCE_2];

import type { BadgeTone } from '../format';

const INTENT_TONE: Record<string, BadgeTone> = {
  support: 'success',
  contrast: 'danger',
  background: 'default',
  method: 'info',
  extension: 'warning',
};

export function CitationManager() {
  const stats: CRIEStat[] = [
    { title: 'References', value: formatNumber(CRIE_CITATION_STATISTICS.references), icon: '📚' },
    { title: 'Citations', value: formatNumber(CRIE_CITATION_STATISTICS.citations), icon: '🔗' },
    { title: 'Contexts', value: formatNumber(CRIE_CITATION_STATISTICS.contexts), icon: '💬' },
    { title: 'Total', value: formatNumber(CRIE_CITATION_STATISTICS.references + CRIE_CITATION_STATISTICS.citations + CRIE_CITATION_STATISTICS.contexts), icon: '🧮' },
  ];

  return (
    <Stack>
      <CRIEStats stats={stats} />

      <Panel eyebrow="Bibliography" title="References" icon="📚">
        <ul className="space-y-3">
          {REFERENCES.map((reference) => (
            <li key={reference.id} className="rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-800">
              <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">{renderCitation(reference, 'apa')}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <Chip tone={confidenceTone(reference.confidence)}>confidence {formatPercent(reference.confidence.value)}</Chip>
                <Chip>{reference.identifierKind} · {reference.identifier}</Chip>
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel eyebrow="Citation edges" title="Citations" icon="🔗">
        <ul className="space-y-3">
          {CRIE_CITATIONS.map((citation) => {
            const reference = REFERENCES.find((candidate) => candidate.id === citation.referenceId);
            const context = CRIE_CITATION_CONTEXTS.find((candidate) => candidate.citationId === citation.id);
            return (
              <li key={citation.id} className="rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{reference?.title ?? citation.referenceId}</p>
                  <Chip>{citation.citationStyle}</Chip>
                </div>
                {context ? (
                  <div className="mt-3 space-y-1">
                    <Chip tone={INTENT_TONE[context.intent] ?? 'default'}>intent: {context.intent}</Chip>
                    {context.quote ? (
                      <blockquote className="mt-2 border-l-2 border-slate-300 pl-4 text-sm italic text-slate-500 dark:border-slate-600 dark:text-slate-400">
                        “{context.quote}”
                      </blockquote>
                    ) : null}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </Panel>
    </Stack>
  );
}
