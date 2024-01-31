import { IsNotEmpty, IsString } from 'class-validator';

export class MainReqBody {
  @IsNotEmpty()
  @IsString()
  base64Data: string;
}
