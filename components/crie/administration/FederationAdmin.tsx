import { crieFederationContracts, crieFederationExchanges, crieMemberSovereignty } from '@/lib/crie/access';
import { crieFederationModel } from '../data';
import { CRIEStats } from '../core';
import type { CRIEStat } from '../core';
import { Panel, Stack, Chip, ConfidenceMeter } from '../primitives';
import { formatDate, formatNumber, statusTone } from '../format';

const EXCHANGE_TONE: Record<string, 'info' | 'success' | 'warning' | 'default'> = {
  query: 'default',
  contribution: 'info',
  aggregate: 'success',
  signal: 'warning',
};

export function FederationAdmin() {
  const sovereignty = crieMemberSovereignty();
  if (!sovereignty) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">No member sovereignty record is registered.</p>;
  }
  const model = crieFederationModel({
    contracts: crieFederationContracts(),
    exchanges: crieFederationExchanges(),
    sovereignty,
  });

  const stats: CRIEStat[] = [
    { title: 'Contracts', value: formatNumber(model.statistics.contracts), icon: '🤝' },
    { title: 'Active', value: formatNumber(model.statistics.activeContracts), icon: '✅' },
    { title: 'Exchanges', value: formatNumber(model.statistics.exchanges), icon: '🔁' },
    { title: 'Sovereignty', value: formatNumber(model.sovereignty.reservedRights.length), icon: '🛡️' },
  ];

  return (
    <Stack>
      <CRIEStats stats={stats} />

      <Panel eyebrow="Federation" title="Contracts" icon="🤝">
        <ul className="space-y-3">
          {model.contracts.map((contract) => (
            <li key={contract.id} className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{contract.id}</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {contract.institutionId} ↔ {contract.memberInstitutionId} · {contract.contractType}
                  </p>
                </div>
                <Chip tone={statusTone(contract.status)}>{contract.status}</Chip>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <Chip>{contract.dataScope.join(', ')}</Chip>
                <Chip>consent: {contract.consentScope.join(', ')}</Chip>
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel eyebrow="Federation" title="Governed exchanges" icon="🔁">
        <ul className="space-y-3">
          {model.exchanges.map((exchange) => (
            <li key={exchange.id} className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{exchange.payloadRef}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{exchange.id} · {exchange.federationContractId} · {formatDate(exchange.createdAt)}</p>
                </div>
                <Chip tone={EXCHANGE_TONE[exchange.exchangeType] ?? 'default'}>{exchange.exchangeType}</Chip>
              </div>
              <div className="mt-3 max-w-sm">
                <ConfidenceMeter confidence={exchange.confidence} />
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel eyebrow="Federation" title="Member sovereignty" icon="🛡️">
        <div className="grid gap-6 lg:grid-cols-3">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Reserved rights</h4>
            <ul className="mt-2 space-y-1.5">
              {model.sovereignty.reservedRights.map((right) => (
                <li key={right} className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">• {right}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Shared signals</h4>
            <ul className="mt-2 space-y-1.5">
              {model.sovereignty.sharedSignals.map((signal) => (
                <li key={signal} className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">• {signal}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Never shared</h4>
            <ul className="mt-2 space-y-1.5">
              {model.sovereignty.neverShared.map((item) => (
                <li key={item} className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:bg-rose-950 dark:text-rose-300">• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </Panel>
    </Stack>
  );
}
