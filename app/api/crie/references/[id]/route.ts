import { crieReferenceService } from '@/lib/crie/services';
import { recordHandlers } from '@/lib/crie/http';

const { GET, PATCH, DELETE } = recordHandlers(crieReferenceService);

export { GET, PATCH, DELETE };
