import { formatRelative } from './format';
import type { ReviewVoiceNote } from '@/types/reviews';

type VoiceNoteCardProps = {
  voiceNote: ReviewVoiceNote;
};

export function VoiceNoteCard({ voiceNote }: VoiceNoteCardProps) {
  return (
    <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-800 dark:bg-violet-950">
      <div className="flex items-center gap-2 text-xs font-semibold text-violet-700 dark:text-violet-300">
        <span>🎙️</span>
        <span>{voiceNote.authorName ?? voiceNote.author}</span>
        <span className="font-normal text-violet-400">· {formatRelative(voiceNote.createdAt)}</span>
        {voiceNote.durationSeconds ? <span className="font-normal text-violet-400">· {voiceNote.durationSeconds}s</span> : null}
        <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[10px] uppercase text-violet-500 dark:bg-violet-900">
          {voiceNote.status}
        </span>
      </div>
      <p className="mt-2 text-sm leading-6 text-violet-900 dark:text-violet-100">{voiceNote.transcript}</p>
      {voiceNote.audioUrl && (
        <p className="mt-2 text-xs text-violet-500">🔗 Original audio retained: {voiceNote.audioUrl}</p>
      )}
    </div>
  );
}
