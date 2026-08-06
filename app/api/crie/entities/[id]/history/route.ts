import { crieEntityService } from '@/lib/crie/services';
import { historyHandlers } from '@/lib/crie/http';

const { GET } = historyHandlers(crieEntityService);

export { GET };
