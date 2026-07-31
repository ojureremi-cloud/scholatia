import React from 'react';
import type { PipelineStage } from '@/constants/placeholder-research';

type ResearchPipelineProps = {
  stages: PipelineStage[];
};

export function ResearchPipeline({ stages }: ResearchPipelineProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stages.map((stage) => (
        <div key={stage.id} className="rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden="true">
              {stage.icon}
            </span>
            <h4 className="font-semibold text-slate-900">{stage.name}</h4>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{stage.description}</p>
          <ul className="mt-4 space-y-2 border-t border-slate-100 pt-3">
            {stage.items.map((item) => (
              <li key={item.project} className="text-sm leading-5">
                <span className="font-medium text-slate-900">{item.project}</span>
                <span className="text-slate-500"> — {item.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
