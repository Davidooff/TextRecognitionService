import { Module } from '@nestjs/common';
import { MainController } from './main.controller';
import { MainService } from './main.service';
import { APP_GUARD } from '@nestjs/core';
import { MainGuard } from './main.guard';

@Module({
  controllers: [MainController],
  providers: [
    MainService,
    {
      provide: APP_GUARD,
      useClass: MainGuard,
    },
  ],
})
export class MainModule {}
