import { crieEntityService } from '@/lib/crie/services';
import { actionHandlers } from '@/lib/crie/http';

const { POST } = actionHandlers(crieEntityService, 'purge');

export { POST };
