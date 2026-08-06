import { crieCitationService } from '@/lib/crie/services';
import { recordHandlers } from '@/lib/crie/http';

const { GET, PATCH, DELETE } = recordHandlers(crieCitationService);

export { GET, PATCH, DELETE };
