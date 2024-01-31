import { Injectable } from '@nestjs/common';
import vision, { ImageAnnotatorClient } from '@google-cloud/vision';

@Injectable()
export class MainService {
  client: ImageAnnotatorClient;
  constructor() {
    this.client = new vision.ImageAnnotatorClient({
      keyFilename: './credentials.json',
    });
  }

  async readImage(base64Image: string) {
    const decodedImage = Buffer.from(base64Image, 'base64');
    const [result] = await this.client.textDetection(decodedImage);
    return result.textAnnotations;
  }
}
