import Badge from '@/components/ui/Badge';
import {
  formatDate,
  formatReportKind,
  formatReportKindIcon,
  formatReportStatus,
  formatReportStatusIcon,
  reportStatusVariant,
} from './format';
import type { Community } from '@/types/communities';

type CommunityModerationProps = {
  community: Community;
};

export function CommunityModeration({ community }: CommunityModerationProps) {
  const reports = community.reports;
  const warnings = community.warnings;

  if (reports.length === 0 && warnings.length === 0) {
    return <p className="text-sm text-slate-400">No reports or warnings on record for this community.</p>;
  }

  return (
    <div className="space-y-6">
      {reports.length > 0 && (
        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Reports ({reports.length})</h4>
          <ul className="space-y-3">
            {reports.map((report) => (
              <li
                key={report.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-lg">{formatReportKindIcon(report.targetKind)}</span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {report.targetTitle ?? report.targetId}
                  </p>
                  <Badge variant="default">{formatReportKind(report.targetKind)}</Badge>
                  <Badge variant={reportStatusVariant(report.status)}>
                    {formatReportStatusIcon(report.status)} {formatReportStatus(report.status)}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{report.reason}</p>
                <p className="mt-1 text-xs text-slate-400">
                  reported by @{report.reporter} · {formatDate(report.createdAt)}
                  {report.resolvedAt ? ` · resolved ${formatDate(report.resolvedAt)}` : ''}
                </p>
                {report.action && (
                  <p className="mt-1 text-xs font-medium text-amber-600 dark:text-amber-400">Action: {report.action}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {warnings.length > 0 && (
        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
            Warnings ({warnings.length})
          </h4>
          <ul className="space-y-3">
            {warnings.map((warning) => (
              <li
                key={warning.id}
                className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950"
              >
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">⚠️ @{warning.username}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{warning.reason}</p>
                <p className="mt-1 text-xs text-slate-400">
                  issued by @{warning.issuedBy} · {formatDate(warning.issuedAt)}
                </p>
                {warning.appeal && (
                  <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                    Appeal: {warning.appeal}
                    {warning.appealedAt ? ` (${formatDate(warning.appealedAt)})` : ''}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
