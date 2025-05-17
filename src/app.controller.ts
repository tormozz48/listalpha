import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  getHello(): { status: string } {
    return { status: 'ok' };
  }
}
