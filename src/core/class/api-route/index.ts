import { ApiMethod } from '../../../shared/enums/api-method.ts';
import { BASE_URL } from '../../../shared/constant/base-url.ts';

export const classRoutes = {
  find: {
    method: ApiMethod.GET,
    route: (offset: number, limit: number) => BASE_URL + `/classes?offset=${offset}&limit=${limit}`,
  },
  findClassTriggerTime: {
    method: ApiMethod.GET,
    route: (classId: number) => BASE_URL + `/classes/trigger-time?offset=0&limit=999&classId=${classId}`,
  },

  findById: {
    method: ApiMethod.GET,
    route: (id: number) => BASE_URL + `/classes/${id}`,
  },
  updateById: {
    method: ApiMethod.PUT,
    route: (id: number) => BASE_URL + `/classes/${id}`,
  },
  deleteById: {
    method: ApiMethod.DELETE,
    route: (id: number) => BASE_URL + `/classes/${id}`,
  },
  create: {
    method: ApiMethod.POST,
    route: BASE_URL + '/classes',
  },
  createClassTriggerTime: {
    method: ApiMethod.POST,
    route: BASE_URL + '/classes/create-class-trigger-time',
  },
  createClassUserMap: {
    method: ApiMethod.POST,
    route: BASE_URL + '/classes/create-class-user-map',
  },
  createLocation: {
    method: ApiMethod.POST,
    route: BASE_URL + '/locations',
  },
  fetchClassUserTimeMap: {
    method: ApiMethod.GET,
    route: (classId: number) => BASE_URL + `/classes/user-map?classId=${classId}`,
  },
};
