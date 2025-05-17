import { Controller, Get } from '@nestjs/common';

@Controller('status')
export class AppController {
  constructor() {}

  @Get()
  getStatus(): { status: string } {
    return { status: 'ok' };
  }
}
