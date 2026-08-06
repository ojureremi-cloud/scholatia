import { crieAgentService } from '@/lib/crie/services';
import { collectionHandlers } from '@/lib/crie/http';

const { GET, POST } = collectionHandlers(crieAgentService);

export { GET, POST };
