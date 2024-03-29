import { Body, Controller, Post } from '@nestjs/common';
import { VerificationCodeService } from './verification-code.service';
import { VerifyEmail } from '../dto/verifyEmail.dto';
import { UserInfo } from '../dto/userInfo.dto';

@Controller('verification-code')
export class VerificationCodeController {
  constructor(
    private readonly verificationCodeService: VerificationCodeService,
  ) {}
  @Post('verify')
  async verify(@Body() verifyEmail: VerifyEmail) {
    await this.verificationCodeService.verify(verifyEmail);
  }

  @Post('resend')
  async resend(@Body() userInfo: UserInfo) {
    await this.verificationCodeService.resend(userInfo);
  }
}
