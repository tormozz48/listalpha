import { Controller, Get } from '@nestjs/common';

@Controller('api')
export class AppController {
  constructor() {}

  @Get('status')
  getStatus(): { status: string } {
    return { status: 'ok' };
  }
}
