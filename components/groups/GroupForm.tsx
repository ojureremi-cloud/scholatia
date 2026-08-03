'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import useGroups from '@/hooks/useGroups';
import { formatCategory } from './format';
import { groupUrl } from '@/lib/groups';
import type { GroupCategory, GroupVisibility } from '@/types/groups';
import { GROUP_CATEGORIES, GROUP_VISIBILITIES } from '@/types/groups';

type GroupFormProps = {
  onCreated?: (id: string) => void;
};

export function GroupForm({ onCreated }: GroupFormProps) {
  const groups = useGroups();
  const router = useRouter();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<GroupCategory>('research-group');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<GroupVisibility>('public');
  const [institution, setInstitution] = useState('');
  const [institutionId, setInstitutionId] = useState('');
  const [department, setDepartment] = useState('');
  const [country, setCountry] = useState('');
  const [discipline, setDiscipline] = useState('');
  const [researchAreasText, setResearchAreasText] = useState('');
  const [keywordsText, setKeywordsText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('A group name is required.');
      return;
    }
    setError('');
    const researchAreas = researchAreasText
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    const keywords = keywordsText
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    const created = groups.createNewGroup({
      name: name.trim(),
      category,
      description: description.trim() || undefined,
      visibility,
      institution: institution.trim() || undefined,
      institutionId: institutionId.trim() || undefined,
      department: department.trim() || undefined,
      country: country.trim() || undefined,
      discipline: discipline.trim() || undefined,
      researchAreas,
      keywords,
    });
    onCreated?.(created.id);
    router.push(groupUrl(created));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5 rounded-[1.75rem] border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Group details</h3>

        <div>
          <label className="block text-sm font-medium text-slate-800 dark:text-slate-100">Group name *</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. West African Health Consortium"
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        <Select
          label="Category"
          options={GROUP_CATEGORIES.map((value) => ({ label: formatCategory(value), value }))}
          value={category}
          onChange={(event) => setCategory(event.target.value as GroupCategory)}
        />

        <div>
          <label className="block text-sm font-medium text-slate-800 dark:text-slate-100">Description</label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            placeholder="What does this group study, produce, or govern?"
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        <Select
          label="Visibility"
          options={GROUP_VISIBILITIES.map((value) => ({
            label: value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' '),
            value,
          }))}
          value={visibility}
          onChange={(event) => setVisibility(event.target.value as GroupVisibility)}
        />
      </div>

      <div className="space-y-5 rounded-[1.75rem] border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Affiliation & focus</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-800 dark:text-slate-100">Institution</label>
            <input
              value={institution}
              onChange={(event) => setInstitution(event.target.value)}
              placeholder="e.g. University of Ibadan"
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800 dark:text-slate-100">Institution ID</label>
            <input
              value={institutionId}
              onChange={(event) => setInstitutionId(event.target.value)}
              placeholder="e.g. INST-UI-001"
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-800 dark:text-slate-100">Department</label>
            <input
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
              placeholder="e.g. College of Medicine"
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800 dark:text-slate-100">Country</label>
            <input
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              placeholder="e.g. Nigeria"
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-800 dark:text-slate-100">Discipline</label>
          <input
            value={discipline}
            onChange={(event) => setDiscipline(event.target.value)}
            placeholder="e.g. Public Health"
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-800 dark:text-slate-100">Research areas (comma separated)</label>
          <input
            value={researchAreasText}
            onChange={(event) => setResearchAreasText(event.target.value)}
            placeholder="e.g. Epidemiology, Health Policy, Vaccinology"
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-800 dark:text-slate-100">Keywords (comma separated)</label>
          <input
            value={keywordsText}
            onChange={(event) => setKeywordsText(event.target.value)}
            placeholder="e.g. malaria, maternal health, surveillance"
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        {error && <p className="text-sm font-medium text-rose-600">{error}</p>}

        <div className="flex flex-wrap gap-3 pt-2">
          <Button size="md" onClick={handleSubmit}>
            Create group
          </Button>
          <Button size="md" variant="outline" href="/groups">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
