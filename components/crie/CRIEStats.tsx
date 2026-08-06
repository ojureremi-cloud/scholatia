import StatisticCard from '@/components/ui/StatisticCard';

export type CRIEStat = {
  title: string;
  value: string;
  trend?: string;
  trendPositive?: boolean;
  icon?: string;
};

type CRIEStatsProps = {
  stats: CRIEStat[];
};

export function CRIEStats({ stats }: CRIEStatsProps) {
  return (
    <section aria-label="CRIE statistics" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatisticCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          trend={stat.trend}
          trendPositive={stat.trendPositive}
          icon={stat.icon}
        />
      ))}
    </section>
  );
}
