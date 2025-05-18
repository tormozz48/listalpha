import { Injectable, Logger } from '@nestjs/common';
import { OpenAIService } from './openAI.service';
import { GoogleAIService } from './googleAI.service';
import { AiProvider, Competitor, Organization } from './types';

@Injectable()
export class AiService implements AiProvider {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly openAIService: OpenAIService,
    private readonly googleAIService: GoogleAIService,
  ) {}

  public isActive(): boolean {
    return this.getActiveProviders().length > 0;
  }

  public async getCompetitors(organization: Organization): Promise<Competitor[]> {
    return await this.runByActiveProvider(
      () => this.getActiveProviders()[0].getCompetitors(organization),
      [],
    );
  }

  private async runByActiveProvider<T>(fn: () => Promise<T>, defaultValue: T): Promise<T> {
    if (!this.isActive()) {
      this.logger.warn('No active providers configured. Empty result returned');
      return defaultValue;
    }
    return fn();
  }

  private getActiveProviders(): AiProvider[] {
    return [this.openAIService, this.googleAIService].filter((provider) => provider.isActive());
  }
}
