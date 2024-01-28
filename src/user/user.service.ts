import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { RegisterBody } from './dto/registerBody.dto';
import { hash } from 'bcrypt';
import { Response } from 'express';
import { VerificationCodeService } from './verification-code/verification-code.service';
import { MailService } from './mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly verificationCodeService: VerificationCodeService,
    private readonly mailService: MailService,
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
      res.redirect('/main');
    }
  }
}
