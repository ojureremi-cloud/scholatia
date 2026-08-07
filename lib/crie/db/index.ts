/**
 * CRIE persistence layer barrel — Mission 004-F (Wave 4).
 *
 * Aggregates the in-memory persistence infrastructure: store, repositories,
 * pagination, query/filter engine, transactions, audit, versioning, soft
 * delete, search indexes, errors, and the dev seed. The production swap
 * contract lives in `lib/crie/db/queries.ts` (SQL fragments mirroring the
 * target schema in `db/schema.sql`).
 */
export * from './adapter';
export * from './audit';
export * from './errors';
export * from './indexes';
export * from './pagination';
export * from './persistence';
export * from './queries';
export * from './repository';
export * from './repositories';
export * from './seed';
export * from './softDelete';
export * from './store';
export * from './transactions';
export { crieIdFor, uuid } from './utils';
export * from './versioning';
