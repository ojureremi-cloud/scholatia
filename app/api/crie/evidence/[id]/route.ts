import { crieEvidenceService } from '@/lib/crie/services';
import { recordHandlers } from '@/lib/crie/http';

const { GET, PATCH, DELETE } = recordHandlers(crieEvidenceService);

export { GET, PATCH, DELETE };
