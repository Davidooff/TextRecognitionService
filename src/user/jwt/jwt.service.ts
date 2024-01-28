import { Injectable } from '@nestjs/common';
import { UserInfo } from '../dto/userInfo.dto';
import { sign } from 'jsonwebtoken';

@Injectable()
export class JwtService {
  genTokens(userInfo: UserInfo) {
    const refreshToken = sign(
      {
        email: userInfo.email,
        iat:
          Math.floor(Date.now() / 1000) +
          parseInt(process.env.REFRESH_TOKEN_ALIVE_TIME),
      },
      process.env.JWT_SECRET,
    );
    const accessToken = sign(
      {
        login: userInfo.login,
        iat:
          Math.floor(Date.now() / 1000) +
          parseInt(process.env.ACCESS_TOKEN_ALIVE_TIME),
      },
      process.env.JWT_SECRET,
    );

    return { accessToken, refreshToken };
  }
}
