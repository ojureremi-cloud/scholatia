import React from 'react';
import ServiceCard from './ServiceCard';
import type { Service } from '@/types/services';

type RelatedServicesListProps = {
  services: Service[];
  usernamesById: Record<string, string>;
  favorites?: Set<string>;
  onToggleFavorite?: (serviceId: string) => void;
};

export default function RelatedServicesList({ services, usernamesById, favorites, onToggleFavorite }: RelatedServicesListProps) {
  if (services.length === 0) {
    return <p className="text-sm text-slate-500">No related services found.</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          providerUsername={usernamesById[service.providerId]}
          favorite={favorites?.has(service.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
