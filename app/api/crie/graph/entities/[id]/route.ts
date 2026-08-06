import { crieGraphService } from '@/lib/crie/services';
import { recordHandlers } from '@/lib/crie/http';

const { GET, PATCH, DELETE } = recordHandlers(crieGraphService);

export { GET, PATCH, DELETE };
