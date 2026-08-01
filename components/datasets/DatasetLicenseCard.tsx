import React from 'react';
import Badge from '@/components/ui/Badge';
import type { DatasetLicense } from '@/types/dataset';

const licenseTypeVariant: Record<DatasetLicense['type'], 'success' | 'warning' | 'default'> = {
  open: 'success',
  restricted: 'warning',
  proprietary: 'default',
};

type DatasetLicenseCardProps = {
  licenses: DatasetLicense[];
};

export function DatasetLicenseCard({ licenses }: DatasetLicenseCardProps) {
  if (licenses.length === 0) {
    return <p className="text-sm text-slate-500">No licence has been assigned yet.</p>;
  }
  return (
    <ul className="space-y-3">
      {licenses.map((license) => (
        <li key={license.id} className="rounded-2xl border border-slate-200 p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h4 className="font-semibold text-slate-900">{license.name}</h4>
              <p className="mt-0.5 text-xs text-slate-500">{license.url}</p>
            </div>
            <Badge variant={licenseTypeVariant[license.type]}>{license.abbreviation}</Badge>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{license.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant={license.allowsCommercialUse ? 'success' : 'danger'}>
              {license.allowsCommercialUse ? 'Commercial use' : 'Non-commercial'}
            </Badge>
            <Badge variant={license.allowsDerivatives ? 'success' : 'danger'}>
              {license.allowsDerivatives ? 'Derivatives allowed' : 'No derivatives'}
            </Badge>
            <Badge variant={license.attributionRequired ? 'info' : 'default'}>
              {license.attributionRequired ? 'Attribution required' : 'No attribution required'}
            </Badge>
          </div>
        </li>
      ))}
    </ul>
  );
}
