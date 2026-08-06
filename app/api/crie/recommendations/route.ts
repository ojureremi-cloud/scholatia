import { crieRecommendationService } from '@/lib/crie/services';
import { collectionHandlers } from '@/lib/crie/http';

const { GET, POST } = collectionHandlers(crieRecommendationService);

export { GET, POST };
