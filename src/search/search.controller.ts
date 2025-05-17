import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { SearchBodyDto, SearchResponseDto } from './dto/search.dto';
import { SearchService } from './search.service';

@Controller('search')
@UseInterceptors(ClassSerializerInterceptor)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post()
  async search(@Body() searchBodyDto: SearchBodyDto): Promise<SearchResponseDto> {
    return this.searchService.search(searchBodyDto.searchValue);
  }
}
