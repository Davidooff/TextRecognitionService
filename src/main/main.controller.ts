import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MainService } from './main.service';
import { MainReqBody } from './dto/mainReqBody.dto';
import { MainGuard } from './main.guard';

@Controller('main')
export class MainController {
  constructor(private readonly mainService: MainService) {}
  @Post()
  @UseGuards(new MainGuard())
  async main(@Body() mainReqBody: MainReqBody) {
    return await this.mainService.readImage(mainReqBody.base64Data);
  }
}
