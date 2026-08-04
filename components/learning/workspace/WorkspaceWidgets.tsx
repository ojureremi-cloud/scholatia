type WorkspaceWidgetsProps = {
  children: React.ReactNode;
};

export function WorkspaceWidgets({ children }: WorkspaceWidgetsProps) {
  return <div className="grid gap-8 xl:grid-cols-2">{children}</div>;
}
