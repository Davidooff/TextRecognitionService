import { Body, Controller, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterBody } from './dto/registerBody.dto';
import { Response } from 'express';
import { LoginBody } from './dto/loginBody.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() registerBody: RegisterBody, @Res() res: Response) {
    await this.userService.register(registerBody, res);
  }

  @Post('login')
  async login(@Body() loginBody: LoginBody, @Res() res: Response) {
    await this.userService.login(loginBody, res);
  }
}
