import { Module } from '@nestjs/common';
import { JwtController } from './jwt.controller';
import { JwtService } from './jwt.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [JwtController],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
