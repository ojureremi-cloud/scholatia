import Breadcrumb from '@/components/ui/Breadcrumb';

export type AdminCrumb = {
  label: string;
  href?: string;
};

export function AdminBreadcrumb({ crumbs }: { crumbs: AdminCrumb[] }) {
  return <Breadcrumb items={[{ label: 'Learning', href: '/learning' }, ...crumbs]} />;
}
