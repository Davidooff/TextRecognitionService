import { UserInfo } from './userInfo.dto';

export interface VerifyEmail {
  user: UserInfo;
  code: number;
}
