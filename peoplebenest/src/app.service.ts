import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      success: true,
      message: 'People Platform API',
    };
  }
}
