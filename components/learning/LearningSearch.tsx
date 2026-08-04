import SearchBox from '@/components/ui/SearchBox';

type LearningSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function LearningSearch({ value, onChange, placeholder = 'Search courses, lessons, and topics...' }: LearningSearchProps) {
  return <SearchBox value={value} onChange={onChange} placeholder={placeholder} />;
}
