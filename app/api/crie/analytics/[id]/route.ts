import { crieAnalyticsService } from '@/lib/crie/services';
import { recordHandlers } from '@/lib/crie/http';

const { GET, PATCH, DELETE } = recordHandlers(crieAnalyticsService);

export { GET, PATCH, DELETE };
