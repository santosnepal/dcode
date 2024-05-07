import { ApiMethod } from '../../../shared/enums/api-method.ts';
import { BASE_URL } from '../../../shared/constant/base-url.ts';

export const notificationRoutes = {
  createNotification: {
    method: ApiMethod.POST,
    route: BASE_URL + '/notifications',
  },
  getAllNotification: {
    method: ApiMethod.GET,
    route: (offset: number, limit: number) => BASE_URL + `/notifications?offset=${offset}&limit=${limit}`,
  },
  getByIdNotification: {
    method: ApiMethod.GET,
    route: (id: number) => BASE_URL + `/notifications/${id}`,
  },
};
