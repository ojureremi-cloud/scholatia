import React from 'react';

type TimelineItemProps = {
  date: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
};

function TimelineItem({ date, icon, children }: TimelineItemProps) {
  return (
    <div className="flex gap-4 pb-8">
      {icon ? <div className="flex-shrink-0">{icon}</div> : null}
      <div className="flex-1">
        <p className="text-sm text-slate-500">{date}</p>
        <div className="mt-1">{children}</div>
      </div>
    </div>
  );
}

type TimelineProps = {
  children: React.ReactNode;
};

function Timeline({ children }: TimelineProps) {
  return <div className="space-y-2">{children}</div>;
}

Timeline.Item = TimelineItem;

export { Timeline };
