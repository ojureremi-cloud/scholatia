import { crieRecommendationService } from '@/lib/crie/services';
import { recordHandlers } from '@/lib/crie/http';

const { GET, PATCH, DELETE } = recordHandlers(crieRecommendationService);

export { GET, PATCH, DELETE };
