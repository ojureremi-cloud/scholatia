/**
 * CRIE engine shared utilities (Mission 004-D, Wave 2).
 *
 * Pure helpers shared by the 28 CRIE engines: slug-based id derivation,
 * bounded rounding, clamping, averaging, ISO timestamps, and calibrated
 * confidence construction (P11, L5).
 */
import type { ConfidenceBand, ConfidenceScore } from '@/types/crie';

export function slugOf(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function round(value: number): number {
  return Math.round(value * 100) / 100;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function average(values: readonly number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function nowIso(): string {
  return new Date().toISOString();
}

/** Map a raw 0..1 value to a calibrated confidence band (CRIE Ch. 11). */
export function confidenceBand(value: number): ConfidenceBand {
  if (value >= 0.8) return 'very-high';
  if (value >= 0.6) return 'high';
  if (value >= 0.4) return 'medium';
  if (value >= 0.2) return 'low';
  return 'very-low';
}

/** Build a calibrated confidence score. */
export function confidence(value: number, basis?: string): ConfidenceScore {
  const v = clamp(value, 0, 1);
  return { value: round(v), band: confidenceBand(v), basis };
}
