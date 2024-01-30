import { HttpException, HttpStatus, Injectable, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { RegisterBody } from './dto/registerBody.dto';
import { hash, compare } from 'bcrypt';
import { Response } from 'express';
import { VerificationCodeService } from './verification-code/verification-code.service';
import { MailService } from './mail/mail.service';
import { LoginBody } from './dto/loginBody.dto';
import { JwtService } from './jwt/jwt.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly verificationCodeService: VerificationCodeService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  async _getEachUser(
    serchObject: object[],
  ): Promise<Array<object | undefined>> {
    const promiseUsers = serchObject.map((el) =>
      this.userModel.findOne(el).lean(),
    );
    const foundUsers = await Promise.all(promiseUsers);
    return foundUsers;
  }

  async register(registerBody: RegisterBody, res: Response) {
    const { login, email } = registerBody;
    const [foundLogin, foundEmail] = await this._getEachUser([
      { login },
      { email },
    ]);

    if (foundEmail && foundLogin) {
      throw new HttpException(
        'Email and Login already exists',
        HttpStatus.CONFLICT,
      );
    }
    if (foundEmail) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }
    if (foundLogin) {
      throw new HttpException('Login already exists', HttpStatus.CONFLICT);
    }

    registerBody.password = await hash(
      registerBody.password,
      parseInt(process.env.SALT_RAOUNDS),
    );
    let emailVerification;
    if (JSON.parse(process.env.EMAIL_VERIFICATION)) {
      emailVerification = [false, this.verificationCodeService.genCode()];
    } else {
      emailVerification = [true];
    }

    await this.userModel.create({ ...registerBody, emailVerification });

    if (!emailVerification[0]) {
      await this.mailService.sendUserConfirmation(
        { login, email },
        emailVerification[1],
      );
      res.redirect('/email-verification');
    } else {
      res.redirect('/login');
    }
  }

  async login(loginBody: LoginBody, @Res() res: Response) {
    const { email, password } = loginBody;
    const foundUser = await this.userModel.findOne({ email }).exec();

    if (!foundUser) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    if (!foundUser.emailVerification[0]) {
      res.redirect('/email-verification');
    }

    const isPassCorect = await compare(password, foundUser.password);
    if (!isPassCorect) {
      throw new HttpException('Incorect password', HttpStatus.BAD_REQUEST);
    }

    const { login } = foundUser;
    const tokens = this.jwtService.genTokens({ login, email });
    foundUser.tokens.push(tokens.refreshToken);
    await foundUser.save();

    const aliveTimeInMs = {
      access: parseInt(process.env.ACCESS_TOKEN_ALIVE_TIME) * 1000,
      refresh: parseInt(process.env.REFRESH_TOKEN_ALIVE_TIME) * 1000,
    };
    res.cookie('accessToken', tokens.accessToken, {
      maxAge: aliveTimeInMs.access,
    });
    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: aliveTimeInMs.refresh,
    });
    res.send();
  }
}
