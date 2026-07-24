'use client';

import React, { useState } from 'react';

type DropdownOption = {
  label: string;
  value: string;
};

type DropdownProps = {
  label: string;
  options: DropdownOption[];
  onSelect: (value: string) => void;
};

export default function Dropdown({ label, options, onSelect }: DropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center justify-between rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm transition hover:bg-slate-50"
      >
        {label}
        <span aria-hidden="true">▾</span>
      </button>
      {open ? (
        <div className="absolute right-0 mt-2 w-48 rounded-3xl border border-slate-200 bg-white shadow-lg">
          <div className="space-y-1 p-2">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onSelect(option.value);
                  setOpen(false);
                }}
                className="w-full rounded-2xl px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
