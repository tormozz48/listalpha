import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CompetitorDto, SearchBodyDto, SearchResponseDto } from './dto/search.dto';
import { SearchService } from './search.service';
import { ApolloOrganization } from 'src/apollo/apollo.dto';

@Controller('search')
@UseInterceptors(ClassSerializerInterceptor)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post()
  async search(@Body() searchBodyDto: SearchBodyDto): Promise<SearchResponseDto> {
    const competitors = await this.searchService.search(searchBodyDto.searchValue);

    return {
      competitors: competitors.map(this.toCompetitorDto),
    };
  }

  private toCompetitorDto(competitor: ApolloOrganization): CompetitorDto {
    const competitorDto = new CompetitorDto();
    Object.assign(competitorDto, competitor);
    return competitorDto;
  }
}
