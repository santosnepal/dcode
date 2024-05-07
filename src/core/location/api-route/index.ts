import { BASE_URL } from '../../../shared/constant/base-url';
import { ApiMethod } from '../../../shared/enums/api-method';

export const locationRoute = {
  createLocation: {
    method: ApiMethod.POST,
    route: BASE_URL + '/locations',
  },

  findAllLocations: {
    method: ApiMethod.GET,
    route: BASE_URL + '/locations',
  },
};
