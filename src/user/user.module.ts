import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { VerificationCodeModule } from './verification-code/verification-code.module';
import { MailModule } from './mail/mail.module';
import { JwtModule } from './jwt/jwt.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    VerificationCodeModule,
    MailModule,
    JwtModule,
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
