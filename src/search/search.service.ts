import { Injectable, Logger } from '@nestjs/common';
import { ApolloService } from '../providers/apollo.service';
import { CompetitorDto } from './dto/search.dto';
import { AiService } from '../providers/ai.service';
import { Competitor, Organization } from 'src/providers/types';

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
      if (!organization) {
        this.logger.log(`Organization not found: ${searchValue}`);
        return [];
      }
      const competitors = await this.aiService.getCompetitors(organization);
      if (competitors.length === 0) {
        this.logger.log(`No competitors found for: ${searchValue}`);
        return [];
      }

      const enrichedCompetitors = await this.getEnrichedCompetitors(competitors);
      const competitorScoresMap = new Map<string, number>();
      competitors.forEach((competitor) => {
        competitorScoresMap.set(competitor.domain, competitor.score);
      });
      return enrichedCompetitors
        .filter(this.isNotSourceOrganization(organization))
        .map((competitor) => ({
          ...competitor,
          score: competitorScoresMap.get(competitor.primaryDomain) ?? 0,
        }));
    } catch (e) {
      this.logger.error(`Search competitors error: ${e.message}`);
      return [];
    }
  }

  private async getEnrichedCompetitors(competitors: Competitor[]): Promise<Organization[]> {
    const competitorDomains = competitors.map((competitor) => competitor.domain);
    return this.apolloService.bulkEnrichOrganizations(competitorDomains);
  }

  private isNotSourceOrganization(
    organization: Organization,
  ): (competitor: Organization) => boolean {
    return (competitor: Organization) => organization.primaryDomain !== competitor.primaryDomain;
  }
}
