import {ApiMethod} from '../../../shared/enums/api-method.ts';
import {BASE_URL} from '../../../shared/constant/base-url.ts';

export const userRoutes = {
  signup: {
    method: ApiMethod.POST,
    route: BASE_URL + '/users/register',
  },
  find: {
    method: ApiMethod.GET,
    route: (offset: number, limit: number, ancestorId: number) =>
      BASE_URL +
      `/users?offset=${offset}&limit=${limit}&role=CHILD&ancestorId=${ancestorId}`,
  },

  findAssociatedChild: {
    method: ApiMethod.GET,
    route: (ancestorId: number) =>
      BASE_URL +
      `/users?offset=0&limit=999&role=CHILD&ancestorId=${ancestorId}`,
  },
  findById: {
    method: ApiMethod.GET,
    route: (id: number) => BASE_URL + `/users/${id}`,
  },
  updateProfile: {
    method: ApiMethod.PATCH,
    route: BASE_URL + '/users/update-profile',
  },
  updatePassword: {
    method: ApiMethod.PUT,
    route: BASE_URL + '/users/update-password',
  },
  updateById: {
    method: ApiMethod.PATCH,
    route: (id: number) => BASE_URL + `/users/${id}`,
  },
  deleteById: {
    method: ApiMethod.DELETE,
    route: (id: number) => BASE_URL + `/users/${id}`,
  },
  create: {
    method: ApiMethod.POST,
    route: BASE_URL + '/users',
  },
};
