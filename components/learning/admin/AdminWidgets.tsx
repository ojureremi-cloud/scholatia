type AdminWidgetsProps = {
  children: React.ReactNode;
};

export function AdminWidgets({ children }: AdminWidgetsProps) {
  return <div className="grid gap-8 xl:grid-cols-2">{children}</div>;
}
