import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { LoginBody } from './loginBody.dto';

export class RegisterBody implements LoginBody {
  @IsString()
  @MinLength(4)
  login: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
