import { Controller, Post, Res } from '@nestjs/common';
import { RefreshTokenBody } from '../dto/refreshTokenBody.dto';
import { Response } from 'express';

@Controller('jwt')
export class JwtController {
  @Post('refresh')
  async refresh(refreshTokenBody: RefreshTokenBody, @Res() res: Response) {
    const { refreshToken } = refreshTokenBody;
  }
}
