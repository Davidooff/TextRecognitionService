import { Body, Controller, Post } from '@nestjs/common';
import { MainService } from './main.service';

@Controller('main')
export class MainController {
  constructor(private readonly mainService: MainService) {}
  @Post()
  async main(@Body() mainReqBody: MainReqBody) {
    return await this.mainService.readImage(mainReqBody.base64Data);
  }
}
