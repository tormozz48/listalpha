import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { SearchBodyDto, SearchResponseDto } from './dto/search.dto';
import { SearchService } from './search.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('search')
@Controller('search')
@UseInterceptors(ClassSerializerInterceptor)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post()
  @ApiOperation({
    summary: 'Find competitors',
    description: 'Find competitors based on domain name',
  })
  @ApiBody({ type: SearchBodyDto })
  @ApiResponse({ status: 200, description: 'List of competitors found', type: SearchResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async search(@Body() searchBodyDto: SearchBodyDto): Promise<SearchResponseDto> {
    const competitors = await this.searchService.search(searchBodyDto.searchValue);
    return {
      competitors,
    };
  }
}
