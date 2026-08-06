import { crieDecisionService } from '@/lib/crie/services';
import { collectionHandlers } from '@/lib/crie/http';

const { GET, POST } = collectionHandlers(crieDecisionService);

export { GET, POST };
