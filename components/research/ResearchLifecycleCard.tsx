import { getResearchLifecycleStages } from '@/lib/research';
import Tabs from '@/components/ui/Tabs';
import SectionTitle from '@/components/ui/SectionTitle';

export const ResearchLifecycleCard = () => {
  const stages = getResearchLifecycleStages();
  
  return (
    <div>
      <SectionTitle 
        eyebrow="Research Lifecycle"
        title="Understanding the stages of academic research"
      />
      
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stages.map((stage) => (
            <div 
              key={stage.id} 
              className="p-4 rounded-xl border border-slate-200 text-center hover:border-slate-300 transition-border"
            >
              <div className="text-2xl mb-2">{stage.icon}</div>
              <h3 className="font-semibold text-slate-900">{stage.name}</h3>
              <p className="text-sm text-slate-600 line-clamp-2">{stage.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          <Tabs 
            tabs={stages.map(stage => {
              return {
                label: stage.name,
                content: (
                  <div className="space-y-4">
                    <p className="text-slate-600">{stage.description}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${stage.color}`}>
                        {stage.id}
                      </span>
                      <span className="text-slate-500">Order: {stage.order}</span>
                    </div>
                  </div>
                )
              };
            })}
          />
        </div>
      </div>
    </div>
  );
};