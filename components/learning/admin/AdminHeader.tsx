type AdminHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon?: string;
  actions?: React.ReactNode;
};

export function AdminHeader({ eyebrow, title, description, icon, actions }: AdminHeaderProps) {
  return (
    <section className="rounded-[2rem] bg-gradient-to-br from-slate-800 via-slate-700 to-indigo-900 p-8 text-white shadow-lg sm:p-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">{eyebrow}</p>
          <h2 className="mt-3 flex items-center gap-3 text-3xl font-semibold leading-tight sm:text-4xl">
            {icon ? <span aria-hidden="true">{icon}</span> : null}
            {title}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">{description}</p>
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </section>
  );
}
