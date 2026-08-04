import SearchBox from '@/components/ui/SearchBox';

type WorkspaceSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function WorkspaceSearch({
  value,
  onChange,
  placeholder = 'Search readings, notes, highlights, and bookmarks...',
}: WorkspaceSearchProps) {
  return <SearchBox value={value} onChange={onChange} placeholder={placeholder} />;
}
