import { crieMemoryService } from '@/lib/crie/services';
import { recordHandlers } from '@/lib/crie/http';

const { GET, PATCH, DELETE } = recordHandlers(crieMemoryService);

export { GET, PATCH, DELETE };
