import { crieReasonService } from '@/lib/crie/services';
import { recordHandlers } from '@/lib/crie/http';

const { GET, PATCH, DELETE } = recordHandlers(crieReasonService);

export { GET, PATCH, DELETE };
