type AdminToolbarProps = {
  children: React.ReactNode;
  className?: string;
};

export function AdminToolbar({ children, className = '' }: AdminToolbarProps) {
  return (
    <div
      className={[
        'flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
