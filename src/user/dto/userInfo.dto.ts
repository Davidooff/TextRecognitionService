import { IsNotEmpty } from 'class-validator';

export class UserInfo {
  @IsNotEmpty()
  login: string;
  @IsNotEmpty()
  email: string;
}
