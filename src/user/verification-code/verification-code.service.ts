import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { VerifyEmail } from '../dto/verifyEmail.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class VerificationCodeService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
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
}
