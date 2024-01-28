import { Injectable } from '@nestjs/common';

@Injectable()
export class VerificationCodeService {
  genCode(): number {
    return Math.floor(Math.random() * 900000) + 100000;
  }
}
