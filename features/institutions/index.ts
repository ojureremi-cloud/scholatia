export type InstitutionFeature = {
  overviewPath: string;
};

export const institutionFeature: InstitutionFeature = {
  overviewPath: '/institutions',
};

export { default as InstitutionCard } from '@/components/institutions/InstitutionCard';
export { default as InstitutionHeader } from '@/components/institutions/InstitutionHeader';
export { default as InstitutionBadge } from '@/components/institutions/InstitutionBadge';
export { default as InstitutionDirectoryCard } from '@/components/institutions/InstitutionDirectoryCard';
export { default as InstitutionStatistics } from '@/components/institutions/InstitutionStatistics';
export { default as InstitutionVerificationCard } from '@/components/institutions/InstitutionVerificationCard';
export { default as InstitutionTrustBadge } from '@/components/institutions/InstitutionTrustBadge';
export { default as FacultyCard } from '@/components/institutions/FacultyCard';
export { default as DepartmentCard } from '@/components/institutions/DepartmentCard';
export { default as CampusCard } from '@/components/institutions/CampusCard';
export { default as AffiliationTimeline } from '@/components/institutions/AffiliationTimeline';
