import { criePolicyModel, crieTrustModel } from '../data';
import { crieInstitutionModel, crieFederationModel } from '../data';
import { CRIEStats } from '../core';
import type { CRIEStat } from '../core';
import { Stack, Chip } from '../primitives';
import { formatNumber } from '../format';

export function SettingsOverview() {
  const policy = criePolicyModel();
  const trust = crieTrustModel();
  const institution = crieInstitutionModel();
  const federation = crieFederationModel();

  const stats: CRIEStat[] = [
    { title: 'Policy rules', value: formatNumber(policy.statistics.rules), icon: '📜' },
    { title: 'Trust scores', value: formatNumber(trust.statistics.total), icon: '🛡️' },
    { title: 'IKOS assets', value: formatNumber(institution.statistics.assets), icon: '📦' },
    { title: 'Federation contracts', value: formatNumber(federation.statistics.contracts), icon: '🤝' },
  ];

  return (
    <Stack>
      <CRIEStats stats={stats} />
      <div className="flex flex-wrap gap-2">
        <Chip tone="success">{formatNumber(policy.statistics.grants)} policy grants</Chip>
        <Chip tone="warning">{formatNumber(policy.statistics.pendingApproval)} pending approvals</Chip>
        <Chip tone="danger">{formatNumber(policy.statistics.refusals)} refusals</Chip>
        <Chip tone="info">{formatNumber(federation.statistics.exchanges)} governed exchanges</Chip>
      </div>
      <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
        Administration surface for CRIE governance: policy enforcement, research-ethics review, trust, institutional
        knowledge assets, and federation. Every consequential action is audited and explainable.
      </p>
    </Stack>
  );
}
