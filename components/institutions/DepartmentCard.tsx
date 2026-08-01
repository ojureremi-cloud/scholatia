'use client';

import React from 'react';
import type { Department } from '@/types/institution';

type DepartmentCardProps = {
  department: Department;
  className?: string;
};

export default function DepartmentCard({ department, className = '' }: DepartmentCardProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">
        {department.facultyName ?? 'Department'}
      </p>
      <h3 className="mt-2 text-lg font-semibold text-slate-900">{department.name}</h3>
      <p className="mt-1 text-sm text-slate-600">Head: {department.head}</p>
      {department.establishedYear ? (
        <p className="mt-1 text-xs text-slate-500">Established {department.establishedYear}</p>
      ) : null}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-xl font-semibold text-slate-900">{department.studentCount ?? 0}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Students</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-xl font-semibold text-slate-900">{department.academicStaffCount ?? 0}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Academic staff</p>
        </div>
      </div>
      {department.researchAreas.length > 0 ? (
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Research areas</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {department.researchAreas.map((area) => (
              <span key={area} className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
                {area}
              </span>
            ))}
          </div>
        </div>
      ) : null}
      {department.laboratories.length > 0 ? (
        <p className="mt-3 text-xs text-slate-500">Laboratories: {department.laboratories.join(', ')}</p>
      ) : null}
    </div>
  );
}
