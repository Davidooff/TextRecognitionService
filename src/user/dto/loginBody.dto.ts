import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginBody {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
