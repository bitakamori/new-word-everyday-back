import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'New Word Everyday Game API is running! 🚀';
  }
}
