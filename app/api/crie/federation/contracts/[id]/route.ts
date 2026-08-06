import { crieFederationService } from '@/lib/crie/services';
import { recordHandlers } from '@/lib/crie/http';

const { GET, PATCH, DELETE } = recordHandlers(crieFederationService);

export { GET, PATCH, DELETE };
