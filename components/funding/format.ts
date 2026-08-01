import type { CurrencyCode, FundingAmount } from '@/types/funding';

export function formatAmount(amount: number, currency: CurrencyCode): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatAmountRange(funding: FundingAmount): string {
  const { currency, min, max, typical } = funding;
  if (min !== undefined && max !== undefined) {
    return `${formatAmount(min, currency)} – ${formatAmount(max, currency)}`;
  }
  if (typical !== undefined) {
    return formatAmount(typical, currency);
  }
  if (min !== undefined) {
    return `${formatAmount(min, currency)}+`;
  }
  if (max !== undefined) {
    return `Up to ${formatAmount(max, currency)}`;
  }
  return formatAmount(0, currency);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatMonth(month: string): string {
  const [year, mon] = month.split('-');
  return new Date(Number(year), Number(mon) - 1, 1).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
}
