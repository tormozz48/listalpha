import { Injectable, Logger } from '@nestjs/common';
import { ApolloService } from '../providers/apollo.service';
import { CompetitorDto } from './dto/search.dto';
import { AiService } from '../providers/ai.service';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    private readonly apolloService: ApolloService,
    private readonly aiService: AiService,
  ) {}

  async search(searchValue: string): Promise<CompetitorDto[]> {
    try {
      const organization = await this.apolloService.enrichOrganization(searchValue);
      const competitors = await this.aiService.getCompetitors(organization);
      if (competitors.length === 0) {
        this.logger.log(`No competitors found for: ${searchValue}`);
        return [];
      }
      const competitorDomains = competitors.map((competitor) => competitor.domain);
      const enrichedCompetitors =
        await this.apolloService.bulkEnrichOrganizations(competitorDomains);
      return enrichedCompetitors;
    } catch (e) {
      this.logger.error(`Search competitors error: ${e.message}`);
      return [];
    }
  }
}
