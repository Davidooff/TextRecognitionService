import { IsNotEmpty } from 'class-validator';
import { UserInfo } from './userInfo.dto';

export interface VerifyEmail {
  user: UserInfo;
  code: number;
}
