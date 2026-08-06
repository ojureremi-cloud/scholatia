import { crieEvidenceService } from '@/lib/crie/services';
import { collectionHandlers } from '@/lib/crie/http';

const { GET, POST } = collectionHandlers(crieEvidenceService);

export { GET, POST };
