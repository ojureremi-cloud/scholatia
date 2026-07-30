import { calculateResearchStatistics } from '@/lib/research';
import StatisticCard from '@/components/ui/StatisticCard';
import SectionTitle from '@/components/ui/SectionTitle';
import { ResearchProject } from '@/types/research';

interface ResearchProjectStatisticsProps {
  projects: ResearchProject[];
}

export const ResearchProjectStatistics = ({ projects }: ResearchProjectStatisticsProps) => {
  const stats = calculateResearchStatistics(projects);
  
  return (
    <section className="space-y-8">
      <SectionTitle 
        eyebrow="Impact"
        title="Research Impact" 
        description="Measuring the scope and scale of our scholarly community"
      />
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatisticCard 
          title="Total Projects" 
          value={stats.totalProjects.toLocaleString()} 
          trend="+12% vs last quarter"
          trendPositive
          icon="🔬"
        />
        <StatisticCard 
          title="Active Projects" 
          value={stats.activeProjects.toLocaleString()} 
          trend="+8% vs last quarter"
          trendPositive
          icon="⚡"
        />
        <StatisticCard 
          title="Completed Projects" 
          value={stats.completedProjects.toLocaleString()} 
          trend="+5% vs last quarter"
          trendPositive
          icon="✅"
        />
        <StatisticCard 
          title="Total Funding" 
          value={`$${stats.totalFunding.toLocaleString()}M`} 
          trend="+15% vs last quarter"
          trendPositive
          icon="💰"
        />
        <StatisticCard 
          title="Avg. Duration" 
          value={`${stats.avgProjectDuration.toFixed(1)} months`} 
          icon="⏱️"
        />
      </div>
    </section>
  );
};