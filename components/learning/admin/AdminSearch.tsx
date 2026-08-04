'use client';

type AdminSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function AdminSearch({ value, onChange, placeholder = 'Search this workspace…' }: AdminSearchProps) {
  return (
    <input
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      aria-label="Search"
      className="w-full min-w-[14rem] rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
    />
  );
}
