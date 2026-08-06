import { crieAnalyticsService } from '@/lib/crie/services';
import { collectionHandlers } from '@/lib/crie/http';

const { GET, POST } = collectionHandlers(crieAnalyticsService);

export { GET, POST };
