import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('status')
@Controller('status')
export class AppController {
  constructor() {}

  @Get()
  @ApiOperation({
    summary: 'Get application status',
    description: 'Returns the current status of the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Application status',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'ok',
          description: 'Status of the application',
        },
      },
    },
  })
  getStatus(): { status: string } {
    return { status: 'ok' };
  }
}
