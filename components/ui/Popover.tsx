'use client';

import React, { useState } from 'react';

type PopoverProps = {
  trigger: React.ReactNode;
  content: React.ReactNode;
};

export default function Popover({ trigger, content }: PopoverProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button type="button" onClick={() => setOpen((prev) => !prev)} className="outline-none">
        {trigger}
      </button>
      {open ? (
        <div className="absolute right-0 mt-2 w-64 rounded-3xl border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-950">
          {content}
        </div>
      ) : null}
    </div>
  );
}
