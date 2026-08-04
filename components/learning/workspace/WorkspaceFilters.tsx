import Select from '@/components/ui/Select';

export type WorkspaceFilterOption = {
  label: string;
  value: string;
};

type WorkspaceSelect = {
  id: string;
  label: string;
  value: string;
  options: WorkspaceFilterOption[];
  onChange: (value: string) => void;
};

type WorkspaceFiltersProps = {
  selects: WorkspaceSelect[];
};

export function WorkspaceFilters({ selects }: WorkspaceFiltersProps) {
  return (
    <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 sm:grid-cols-2 lg:grid-cols-4">
      {selects.map((select) => (
        <Select
          key={select.id}
          label={select.label}
          id={select.id}
          options={select.options}
          value={select.value}
          onChange={(event) => select.onChange(event.target.value)}
        />
      ))}
    </div>
  );
}
