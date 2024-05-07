import {ApiMethod} from '../../../shared/enums/api-method.ts';
import {BASE_URL} from '../../../shared/constant/base-url.ts';

export const authRoutes = {
  login: {
    method: ApiMethod.POST,
    route: BASE_URL + '/auth/login',
  },
  forgotPasswordOtpGeneration: {
    method: ApiMethod.POST,
    route: BASE_URL + '/users/forgot-password-otp-generation',
  },
  forgotPassword: {
    method: ApiMethod.POST,
    route: BASE_URL + '/users/forgot-password',
  },
};
