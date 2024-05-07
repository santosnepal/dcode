export interface IAuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  fullName: string;
}

export interface IAuthUserWithToken {
  accessToken: string;
  user: IAuthUser;
}
