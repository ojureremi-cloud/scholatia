import React from 'react';
import SectionTitle from '../ui/SectionTitle';
import Card from '../ui/Card';

const ecosystemSegments = [
  {
    label: 'Students',
    description:
      'Student profiles, academic portfolios, research interests, scholarships, mentorship and career opportunities for future-ready learners.',
  },
  {
    label: 'Researchers',
    description:
      'Researcher profiles, publications, collaborations and funding pathways across global academic disciplines.',
  },
  {
    label: 'Institutions',
    description:
      'Institutions include universities, colleges, polytechnics, research centres, teaching hospitals and professional schools.',
  },
  {
    label: 'Journals',
    description:
      'Journal publishing, editorial alignment, peer review and cross-publisher visibility for academic outlets.',
  },
  {
    label: 'Conferences',
    description:
      'Conference planning, partner engagement, participation, programme discovery and event verification.',
  },
  {
    label: 'Publishers',
    description:
      'Publisher services for editorial workflows, distribution, rights management and research dissemination.',
  },
  {
    label: 'Funding Organisations',
    description:
      'Funding and grant discovery, sponsor relationships, award tracking and research investment intelligence.',
  },
];

export default function Ecosystem() {
  return (
    <section id="people" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle
          eyebrow="Academic ecosystems"
          title="Connecting students, researchers, institutions and academic communities"
        />
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          People includes students, researchers, academics, professionals, reviewers and editors. Institutions include universities, colleges, institutes, academies, research centres, laboratories, teaching hospitals, professional schools, think tanks, government research organisations and international education organisations.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {ecosystemSegments.map((segment) => (
            <Card key={segment.label} className="border border-slate-200 bg-slate-50 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">{segment.label}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{segment.description}</p>
            </Card>
          ))}
        </div>
        <div id="institutions" className="mt-12 rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Institutional network</h3>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Scholatia treats institutions as the primary organisational category. This encompasses universities, colleges of education, polytechnics, institutes, academies, research centres, laboratories, teaching hospitals, professional schools, think tanks, government research organisations and international education organisations.
          </p>
        </div>
      </div>
    </section>
  );
}
