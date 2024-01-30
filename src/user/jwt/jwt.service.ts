import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserInfo } from '../dto/userInfo.dto';
import { sign, verify } from 'jsonwebtoken';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { Response } from 'express';

@Injectable()
export class JwtService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

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

  async refreshTokens(token: string, res: Response) {
    const verifed = verify(token, process.env.JWT_SECRET);
    if (!verifed || typeof verifed !== 'object' || !('email' in verifed)) {
      throw new HttpException('Token is not valid', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.userModel
      .findOne({ email: verifed.email })
      .exec();
    if (!foundUser) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    if (!(token in foundUser.tokens)) {
      throw new HttpException(
        'User with this token not found',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { login, email } = foundUser;
    const newTokens = this.genTokens({ login, email });

    foundUser.tokens[foundUser.tokens.indexOf(token)] = newTokens.refreshToken;
    await foundUser.save();

    const aliveTimeInMs = {
      access: parseInt(process.env.ACCESS_TOKEN_ALIVE_TIME) * 1000,
      refresh: parseInt(process.env.REFRESH_TOKEN_ALIVE_TIME) * 1000,
    };
    res.cookie('accessToken', newTokens.accessToken, {
      maxAge: aliveTimeInMs.access,
    });
    res.cookie('refreshToken', newTokens.refreshToken, {
      maxAge: aliveTimeInMs.refresh,
    });
    res.send();
  }
}
