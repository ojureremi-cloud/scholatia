import { crieGraphRelationService } from '@/lib/crie/services';
import { recordHandlers } from '@/lib/crie/http';

const { GET, PATCH, DELETE } = recordHandlers(crieGraphRelationService);

export { GET, PATCH, DELETE };
