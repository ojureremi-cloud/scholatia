import { crieMemoryService } from '@/lib/crie/services';
import { collectionHandlers } from '@/lib/crie/http';

const { GET, POST } = collectionHandlers(crieMemoryService);

export { GET, POST };
