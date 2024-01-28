import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { BcryptService } from './bcrypt/bcrypt.service';
import { VerificationCodeModule } from './verification-code/verification-code.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    VerificationCodeModule,
  ],
  providers: [UserService, BcryptService],
  controllers: [UserController],
})
export class UserModule {}
