import { crieReferenceService } from '@/lib/crie/services';
import { collectionHandlers } from '@/lib/crie/http';

const { GET, POST } = collectionHandlers(crieReferenceService);

export { GET, POST };
