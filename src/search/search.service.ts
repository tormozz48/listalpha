import { Injectable } from '@nestjs/common';
import { ApolloService } from '../apollo/apollo.service';
import { ApolloOrganization } from 'src/apollo/apollo.dto';

@Injectable()
export class SearchService {
  constructor(private readonly apolloService: ApolloService) {}

  async search(searchValue: string): Promise<ApolloOrganization[]> {
    try {
      const organization = await this.apolloService.enrichOrganization(searchValue);
      return [organization];
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}
