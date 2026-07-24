'use client';

import React, { useState } from 'react';

type AccordionItem = {
  title: string;
  content: React.ReactNode;
};

type AccordionProps = {
  items: AccordionItem[];
};

export default function Accordion({ items }: AccordionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={item.title} className="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-950">
          <button
            type="button"
            onClick={() => setActiveIndex(index === activeIndex ? -1 : index)}
            className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-100"
          >
            <span>{item.title}</span>
            <span>{activeIndex === index ? '−' : '+'}</span>
          </button>
          {activeIndex === index ? <div className="border-t border-slate-200 px-5 py-4 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">{item.content}</div> : null}
        </div>
      ))}
    </div>
  );
}
