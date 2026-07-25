import type { ScholatiaAcademicIdentity } from '@/types/identity';
import Badge from './Badge';
import InstitutionBadge from './InstitutionBadge';
import RoleBadge from './RoleBadge';
import TrustBadge from './TrustBadge';
import VerificationBadge from './VerificationBadge';

type IdentityCardProps = {
  identity: ScholatiaAcademicIdentity;
  className?: string;
};

export default function IdentityCard({ identity, className = '' }: IdentityCardProps) {
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-8 shadow-sm', className].filter(Boolean).join(' ')}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">Scholatia Academic Identity</p>
          <h2 className="mt-4 text-2xl font-semibold text-slate-900">{identity.displayName}</h2>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <Badge variant="info" className="rounded-full py-1 px-2 text-xs font-semibold uppercase tracking-[0.24em]">
              {identity.accountType}
            </Badge>
            <span className="font-mono text-slate-700">{identity.said}</span>
          </div>
        </div>
        <div className="grid gap-2 sm:text-right">
          <VerificationBadge level={identity.verificationLevel} />
          <TrustBadge score={identity.trustScore} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto]">
        <div className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Affiliated institution</p>
              <p className="mt-2 text-sm text-slate-700">{identity.affiliatedInstitution ?? 'Not assigned'}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Joined</p>
              <p className="mt-2 text-sm text-slate-700">{new Date(identity.joinedAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {identity.roles.map((role) => (
              <RoleBadge key={role} role={role} />
            ))}
          </div>
        </div>

        {identity.institutionType ? (
          <InstitutionBadge name={identity.institutionType} type={identity.institutionType} />
        ) : null}
      </div>
    </section>
  );
}
