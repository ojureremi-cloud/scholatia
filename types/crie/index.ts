/**
 * CRIE type barrel — Mission 004-D (Waves 1 & 2).
 *
 * Aggregates the CRIE domain model (fspec Chs. 2–4). The barrel is additive:
 * every name below is CRIE-prefixed or CRIE-unique. Names that already exist
 * in the Learning Ecosystem (`ResearcherRef`, `LearningRecommendation`,
 * `AnalyticsScope`) are disambiguated in `types/index.ts` by explicit type
 * re-export.
 */
export * from './base';
export * from './cognitive';
export * from './context';
export * from './knowledge';
export * from './semantic';
export * from './reasoning';
export * from './evidence';
export * from './document';
export * from './literature';
export * from './methodology';
export * from './statistics';
export * from './ethics';
export * from './integrity';
export * from './writing';
export * from './supervision';
export * from './peer-review';
export * from './publication';
export * from './grant';
export * from './patent';
export * from './innovation';
export * from './career';
export * from './mentorship';
export * from './institution';
export * from './intelligence';
export * from './analytics';
export * from './decision';
export * from './prediction';
export * from './memory';
export * from './conversation';
export * from './agents';
export * from './orchestration';
export * from './connectors';
export * from './federation';
export * from './governance';
export * from './dto';
export * from './learning';
export * from './persistence';
