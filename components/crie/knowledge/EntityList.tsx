'use client';

import { useMemo, useState } from 'react';
import type { KGEntity } from '@/types/crie';
import { KG_ENTITY_CLASSES } from '@/types/crie';
import { CRIEFilters } from '../core';
import EmptyState from '@/components/ui/EmptyState';
import { kgEntityClassLabel } from '../format';
import { EntityCard } from './EntityCard';

type EntityListProps = {
  entities: KGEntity[];
};

export function EntityList({ entities }: EntityListProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(() => {
    if (selected.length === 0) return entities;
    return entities.filter((entity) => selected.includes(entity.entityClass));
  }, [entities, selected]);

  return (
    <div className="space-y-4">
      <CRIEFilters
        label="Class"
        options={KG_ENTITY_CLASSES.map((entityClass) => ({ value: entityClass, label: kgEntityClassLabel(entityClass) }))}
        selected={selected}
        onChange={setSelected}
      />
      {filtered.length === 0 ? (
        <EmptyState
          title="No entities found"
          description="Try clearing the class filters, or add entities to the graph."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((entity) => (
            <EntityCard key={entity.crieId} entity={entity} />
          ))}
        </div>
      )}
    </div>
  );
}
