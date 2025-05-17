import { Injectable } from '@nestjs/common';
import { CompetitorDto, SearchResponseDto } from './dto/search.dto';
import { ApolloService } from '../apollo/apollo.service';

@Injectable()
export class SearchService {
  constructor(private readonly apolloService: ApolloService) {}

  async search(searchValue: string): Promise<SearchResponseDto> {
    try {
      const organization = await this.apolloService.enrichOrganization(searchValue);
      const competitor = new CompetitorDto();
      Object.assign(competitor, organization);
      return {
        competitors: [competitor],
      };
    } catch (e) {
      console.error(e);
      return { competitors: [] };
    }
  }
}
