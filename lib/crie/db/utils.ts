import { randomUUID } from 'node:crypto';
import { nowIso } from '@/lib/crie/utils';

export function uuid(): string {
  return randomUUID();
}

export { nowIso };

export function crieIdFor(table: string, seed: string): string {
  const slug = seed
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `crie-${table}-${slug}`;
}
