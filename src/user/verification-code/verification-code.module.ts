import { Module } from '@nestjs/common';
import { VerificationCodeController } from './verification-code.controller';
import { VerificationCodeService } from './verification-code.service';

@Module({
  controllers: [VerificationCodeController],
  providers: [VerificationCodeService],
  exports: [VerificationCodeService],
})
export class VerificationCodeModule {}
