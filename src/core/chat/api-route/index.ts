import { ApiMethod } from '../../../shared/enums/api-method.ts';
import { BASE_URL } from '../../../shared/constant/base-url.ts';

export const chatRoutes = {
  createChat: {
    method: ApiMethod.POST,
    route: BASE_URL + '/chats',
  },
  getAllChat: {
    method: ApiMethod.GET,
    route: (sender: string, receiver: string) => BASE_URL + `/chats?sender=${sender}&receiver=${receiver}`,
  },
  getChatById: {
    method: ApiMethod.GET,
    route: (id: number) => BASE_URL + `/chats/${id}`,
  },
  getLatestChat: {
    method: ApiMethod.GET,
    route: BASE_URL + '/chats/latest',
  },
};
