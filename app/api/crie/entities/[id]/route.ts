import { crieEntityService } from '@/lib/crie/services';
import { recordHandlers } from '@/lib/crie/http';

const { GET, PATCH, DELETE } = recordHandlers(crieEntityService);

export { GET, PATCH, DELETE };
