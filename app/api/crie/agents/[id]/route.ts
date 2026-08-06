import { crieAgentService } from '@/lib/crie/services';
import { recordHandlers } from '@/lib/crie/http';

const { GET, PATCH, DELETE } = recordHandlers(crieAgentService);

export { GET, PATCH, DELETE };
