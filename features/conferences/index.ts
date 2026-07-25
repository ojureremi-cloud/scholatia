export type ConferenceFeature = {
  listPath: string;
};

export const conferenceFeature: ConferenceFeature = {
  listPath: '/conferences',
};

export { default as ConferenceCard } from '@/components/conferences/ConferenceCard';
export { default as ConferenceHeader } from '@/components/conferences/ConferenceHeader';
export { default as ConferenceStatistics } from '@/components/conferences/ConferenceStatistics';
export { default as ConferenceBadge } from '@/components/conferences/ConferenceBadge';
export { default as ConferenceTimeline } from '@/components/conferences/ConferenceTimeline';
export { default as CommitteeCard } from '@/components/conferences/CommitteeCard';
export { default as RegistrationCard } from '@/components/conferences/RegistrationCard';
export { default as SubmissionCard } from '@/components/conferences/SubmissionCard';
export { default as SpeakerCard } from '@/components/conferences/SpeakerCard';
export { default as SponsorCard } from '@/components/conferences/SponsorCard';
export { default as VenueCard } from '@/components/conferences/VenueCard';
export { default as ScheduleCard } from '@/components/conferences/ScheduleCard';
