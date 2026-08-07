import type { NextRequest } from 'next/server';
import type { ResearchRecommendation } from '@/types/crie';
import { crieCurrentResearcher, crieEntities, crieEntity, crieResearchGaps } from '@/lib/crie/access';
import {
  createResearchRecommendation,
  rankResearchRecommendations,
  recommendNextStep,
  recommendationReason,
  researchRecommendationStatistics,
} from '@/lib/crie/research-recommendations';
import { crieErrorResponse, jsonCrie, requirePrincipal } from '@/lib/crie/http';

export async function GET(request: NextRequest) {
  try {
    await requirePrincipal(request);
    const url = new URL(request.url);
    const entityId = url.searchParams.get('entityId') ?? undefined;
    const entity = entityId ? crieEntity(entityId) : crieEntities()[0];
    const owner = crieCurrentResearcher();
    const recommendations: ResearchRecommendation[] = [];
    if (entity) recommendations.push(recommendNextStep(entity));
    const gaps = crieResearchGaps()
      .filter((gap) => !entityId || gap.researchEntityId === entityId)
      .slice(0, 4);
    for (const gap of gaps) {
      recommendations.push(
        createResearchRecommendation({
          label: `${gap.id}-gap`,
          owner,
          researchEntityId: entity?.id ?? gap.researchEntityId ?? '',
          kind: 'evidence-gap',
          title: 'Close an evidence gap',
          summary: gap.statement,
          reasons: [recommendationReason('evidence', `Gap of type ${gap.gapType}.`, [gap.id])],
          confidenceValue: 0.6,
        }),
      );
    }
    const ranked = rankResearchRecommendations(recommendations);
    return jsonCrie({
      entityId: entity?.id,
      recommendations: ranked,
      statistics: researchRecommendationStatistics(ranked),
    });
  } catch (error) {
    return crieErrorResponse(error);
  }
}
