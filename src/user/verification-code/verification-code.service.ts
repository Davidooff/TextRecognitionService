import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { VerifyEmail } from '../dto/verifyEmail.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { UserInfo } from '../dto/userInfo.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class VerificationCodeService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mailService: MailService,
  ) {}
  difBetNowAndDate(checkDate: Date) {
    const now = new Date();
    const diffInMilliseconds = Math.abs(now.getTime() - checkDate.getTime());
    return diffInMilliseconds;
  }

  genCode(): number {
    return Math.floor(Math.random() * 900000) + 100000;
  }

  async verify(verifyEmail: VerifyEmail) {
    const foundUser = await this.userModel.findOne(verifyEmail.user).exec();

    if (!foundUser) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    if (foundUser.emailVerification[0]) {
      throw new HttpException('User already verifyed', HttpStatus.OK);
    }

    if (verifyEmail.code !== foundUser.emailVerification[1]) {
      throw new HttpException('Wrong code', HttpStatus.BAD_REQUEST);
    }

    const difBetNowAndDate = this.difBetNowAndDate(foundUser.updatedAt);
    if (difBetNowAndDate > parseInt(process.env.VERIFICATION_ALIVE_TIME)) {
      throw new HttpException('Code expired', HttpStatus.BAD_REQUEST);
    }

    foundUser.emailVerification = [true];
    foundUser.save();
  }

  async resend(userInfo: UserInfo) {
    const foundUser = await this.userModel.findOne(userInfo).exec();

    if (!foundUser) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    if (foundUser.emailVerification[0]) {
      throw new HttpException('User already verifyed', HttpStatus.BAD_REQUEST);
    }

    const updatedTime = this.difBetNowAndDate(foundUser.updatedAt);

    const RESEND_TIMEOUT = parseInt(process.env.RESEND_TIMEOUT);
    const RESEND_TIMEOUT_IN_MIN = RESEND_TIMEOUT / 1000 / 60;
    if (updatedTime < RESEND_TIMEOUT) {
      throw new HttpException(
        `Wait ${RESEND_TIMEOUT_IN_MIN} min before resend`,
        HttpStatus.METHOD_NOT_ALLOWED,
      );
    }

    foundUser.emailVerification[1] = this.genCode();
    await foundUser.save();

    await this.mailService.sendUserConfirmation(
      userInfo,
      foundUser.emailVerification[1],
    );
  }
}
