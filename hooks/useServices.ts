'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  filterServices,
  searchServices,
  sortServices,
} from '@/lib/services';
import type { ServiceFilter, ServiceSort } from '@/lib/services';
import {
  BOUGHT_TOGETHER,
  RELATED_TO_FEATURED,
  SERVICE_PORTFOLIO,
} from '@/constants/placeholder-services';
import type { ServiceCategory } from '@/types/services';

export default function useServices() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | ServiceCategory>('all');
  const [group, setGroup] = useState<string>('');
  const [sort, setSort] = useState<ServiceSort>('relevance');
  const [priceRange, setPriceRange] = useState<{ min?: number; max?: number }>({});
  const [favorites, setFavorites] = useState<Set<string>>(
    () => new Set(SERVICE_PORTFOLIO.services.filter((service) => service.favorites > 40).slice(0, 8).map((service) => service.id)),
  );
  const [savedBundles, setSavedBundles] = useState<Set<string>>(() => new Set());

  const filtered = useMemo(() => {
    const filter: ServiceFilter = { query, category };
    if (group) filter.group = group;
    if (priceRange.min != null) filter.minPrice = priceRange.min;
    if (priceRange.max != null) filter.maxPrice = priceRange.max;
    return sortServices(filterServices(SERVICE_PORTFOLIO.services, filter), sort, query);
  }, [query, category, group, sort, priceRange]);

  const searchResults = useMemo(
    () => (query.trim() ? searchServices(SERVICE_PORTFOLIO.services, query, 12) : filtered.slice(0, 12)),
    [query, filtered],
  );

  const toggleFavorite = useCallback((serviceId: string) => {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(serviceId)) {
        next.delete(serviceId);
      } else {
        next.add(serviceId);
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback((serviceId: string) => favorites.has(serviceId), [favorites]);

  const toggleBundleSave = useCallback((bundleId: string) => {
    setSavedBundles((current) => {
      const next = new Set(current);
      if (next.has(bundleId)) {
        next.delete(bundleId);
      } else {
        next.add(bundleId);
      }
      return next;
    });
  }, []);

  const isBundleSaved = useCallback((bundleId: string) => savedBundles.has(bundleId), [savedBundles]);

  return useMemo(
    () => ({
      portfolio: SERVICE_PORTFOLIO,
      query,
      setQuery,
      category,
      setCategory,
      group,
      setGroup,
      sort,
      setSort,
      priceRange,
      setPriceRange,
      filtered,
      searchResults,
      favorites,
      isFavorite,
      toggleFavorite,
      savedBundles,
      isBundleSaved,
      toggleBundleSave,
      relatedToFeatured: RELATED_TO_FEATURED,
      boughtTogether: BOUGHT_TOGETHER,
    }),
    [
      query,
      category,
      group,
      sort,
      priceRange,
      filtered,
      searchResults,
      favorites,
      isFavorite,
      toggleFavorite,
      savedBundles,
      isBundleSaved,
      toggleBundleSave,
    ],
  );
}
