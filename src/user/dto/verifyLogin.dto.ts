import { UserInfo } from './userInfo.dto';

export interface VerifyLogin {
  user: UserInfo;
  code: string;
}
