'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import useCommunities from '@/hooks/useCommunities';
import { communityUrl } from '@/lib/communities';
import { formatCategory } from './format';
import type { CommunityCategory, CommunityVisibility } from '@/types/communities';
import { COMMUNITY_CATEGORIES, COMMUNITY_VISIBILITIES } from '@/types/communities';

type CommunityFormProps = {
  onCreated?: (id: string) => void;
};

export function CommunityForm({ onCreated }: CommunityFormProps) {
  const communities = useCommunities();
  const router = useRouter();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<CommunityCategory>('research');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<CommunityVisibility>('public');
  const [discipline, setDiscipline] = useState('');
  const [language, setLanguage] = useState('');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [researchAreasText, setResearchAreasText] = useState('');
  const [keywordsText, setKeywordsText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('A community name is required.');
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
    const created = communities.createNewCommunity({
      name: name.trim(),
      category,
      description: description.trim() || undefined,
      visibility,
      discipline: discipline.trim() || undefined,
      researchAreas,
      keywords,
      language: language.trim() || undefined,
      country: country.trim() || undefined,
      region: region.trim() || undefined,
    });
    onCreated?.(created.id);
    router.push(communityUrl(created));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5 rounded-[1.75rem] border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Community details</h3>

        <div>
          <label className="block text-sm font-medium text-slate-800 dark:text-slate-100">Community name *</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. African Centre for Health Innovation"
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        <Select
          label="Category"
          options={COMMUNITY_CATEGORIES.map((value) => ({ label: formatCategory(value), value }))}
          value={category}
          onChange={(event) => setCategory(event.target.value as CommunityCategory)}
        />

        <div>
          <label className="block text-sm font-medium text-slate-800 dark:text-slate-100">Description</label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            placeholder="What does this community study, exchange, or govern?"
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        <Select
          label="Visibility"
          options={COMMUNITY_VISIBILITIES.map((value) => ({
            label: value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' '),
            value,
          }))}
          value={visibility}
          onChange={(event) => setVisibility(event.target.value as CommunityVisibility)}
        />
      </div>

      <div className="space-y-5 rounded-[1.75rem] border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Affiliation & focus</h3>

        <div className="grid gap-4 sm:grid-cols-2">
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
            <label className="block text-sm font-medium text-slate-800 dark:text-slate-100">Language</label>
            <input
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              placeholder="e.g. English"
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-800 dark:text-slate-100">Country</label>
            <input
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              placeholder="e.g. Nigeria"
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800 dark:text-slate-100">Region</label>
            <input
              value={region}
              onChange={(event) => setRegion(event.target.value)}
              placeholder="e.g. West Africa"
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-800 dark:text-slate-100">
            Research areas (comma separated)
          </label>
          <input
            value={researchAreasText}
            onChange={(event) => setResearchAreasText(event.target.value)}
            placeholder="e.g. Epidemiology, Health Policy, Vaccinology"
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-800 dark:text-slate-100">
            Keywords (comma separated)
          </label>
          <input
            value={keywordsText}
            onChange={(event) => setKeywordsText(event.target.value)}
            placeholder="e.g. innovation, health systems, genomics"
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        {error && <p className="text-sm font-medium text-rose-600">{error}</p>}

        <div className="flex flex-wrap gap-3 pt-2">
          <Button size="md" onClick={handleSubmit}>
            Create community
          </Button>
          <Button size="md" variant="outline" href="/communities">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
