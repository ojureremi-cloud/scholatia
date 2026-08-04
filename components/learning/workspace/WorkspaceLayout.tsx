type WorkspaceLayoutProps = {
  children: React.ReactNode;
  sidebar: React.ReactNode;
};

export function WorkspaceLayout({ children, sidebar }: WorkspaceLayoutProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
      <aside className="min-w-0">{sidebar}</aside>
      <div className="min-w-0 space-y-10">{children}</div>
    </div>
  );
}
