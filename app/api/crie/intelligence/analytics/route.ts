import type { NextRequest } from 'next/server';
import { crieAnalytics } from '@/lib/crie/access';
import {
  analyticsIntelligenceStatistics,
  indicatorsFromAnalytics,
  risingIndicators,
  strongestIndicators,
} from '@/lib/crie/analytics-intelligence';
import { crieErrorResponse, jsonCrie, requirePrincipal } from '@/lib/crie/http';

export async function GET(request: NextRequest) {
  try {
    await requirePrincipal(request);
    const url = new URL(request.url);
    const rawLimit = Number(url.searchParams.get('limit') ?? 8);
    const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(8, Math.trunc(rawLimit)) : 8;
    const analyticsList = crieAnalytics();
    const latest = analyticsList[analyticsList.length - 1];
    if (!latest) {
      return jsonCrie({ indicators: [], strongest: [], rising: [], statistics: analyticsIntelligenceStatistics([]) });
    }
    const previous = analyticsList.length > 1 ? analyticsList[analyticsList.length - 2] : undefined;
    const indicators = indicatorsFromAnalytics(latest, previous);
    return jsonCrie({
      scopeId: latest.scopeId,
      generatedAt: latest.generatedAt,
      indicators,
      strongest: strongestIndicators(indicators, limit),
      rising: risingIndicators(indicators),
      statistics: analyticsIntelligenceStatistics(indicators),
    });
  } catch (error) {
    return crieErrorResponse(error);
  }
}
