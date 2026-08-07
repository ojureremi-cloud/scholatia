import type { NextRequest } from 'next/server';
import { crieCurrentResearcher, crieEntities, crieEntity, crieEvidence, crieResearchGaps } from '@/lib/crie/access';
import {
  createResearchAnswer,
  researchAssistantReport,
  researchAssistantStatistics,
} from '@/lib/crie/research-assistant';
import { missingEvidence } from '@/lib/crie/decision-support';
import { recommendNextStep } from '@/lib/crie/research-recommendations';
import { crieErrorResponse, jsonCrie, requirePrincipal } from '@/lib/crie/http';

export async function GET(request: NextRequest) {
  try {
    await requirePrincipal(request);
    const url = new URL(request.url);
    const entityId = url.searchParams.get('entityId') ?? undefined;
    const entity = entityId ? crieEntity(entityId) : crieEntities()[0];
    if (!entity) {
      return jsonCrie({ report: undefined, statistics: undefined });
    }
    const owner = crieCurrentResearcher();
    const evidence = crieEvidence()
      .filter((record) => record.researchEntityId === entity.id)
      .slice(0, 6);
    const answers = evidence.map((record) =>
      createResearchAnswer({
        label: `evidence-${record.id}`,
        researchEntityId: entity.id,
        question: 'What does this evidence establish for the entity?',
        summary: record.summary,
        evidenceRecordIds: [record.id],
        confidenceValue: record.confidence.value,
      }),
    );
    const gaps = crieResearchGaps()
      .filter((gap) => gap.researchEntityId === entity.id)
      .slice(0, 4)
      .map((gap) =>
        missingEvidence(gap.statement, `Closing this gap advances the ${entity.model.stage} stage.`, [gap.id]),
      );
    const recommendations = [recommendNextStep(entity)];
    const report = researchAssistantReport({
      label: `${entity.id}-assistant`,
      owner,
      researchEntityId: entity.id,
      answers,
      recommendations,
      gaps,
      evidenceRecords: evidence,
    });
    return jsonCrie({ report, statistics: researchAssistantStatistics(report) });
  } catch (error) {
    return crieErrorResponse(error);
  }
}
