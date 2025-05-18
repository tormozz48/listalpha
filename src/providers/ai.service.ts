import { Injectable, Logger } from '@nestjs/common';
import { Competitor, Organization } from './types';
import { z } from 'zod';
import { CoreMessage, generateObject, Message } from 'ai';
import { google } from '@ai-sdk/google';
import { ConfigService } from '@nestjs/config';
import { openai } from '@ai-sdk/openai';

const CompetitorSchema = z.array(
  z
    .object({
      domain: z.string(),
      score: z.number().min(0).max(1),
    })
    .strict(),
);

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(private readonly configService: ConfigService) {}

  public async getCompetitors(organization: Organization): Promise<Competitor[]> {
    const result = await generateObject({
      model: this.getProvider(),
      schema: CompetitorSchema,
      messages: this.getMessages(organization),
    });
    return result.object.map((competitor) => ({
      domain: competitor.domain,
      score: competitor.score,
    }));
  }

  private getProvider() {
    if (this.configService.get<string>('GOOGLE_GENERATIVE_AI_API_KEY')) {
      this.logger.log('Using Google AI provider');
      return google('gemini-2.0-flash-exp', {
        structuredOutputs: true,
      });
    }
    if (this.configService.get<string>('OPENAI_API_KEY')) {
      this.logger.log('Using OpenAI provider');
      return openai('gpt-4o', {
        structuredOutputs: true,
      });
    }
    throw new Error('No AI provider configured');
  }

  private getMessages(organization: Organization): CoreMessage[] | Omit<Message, 'id'>[] {
    return [
      {
        role: 'system',
        content: `
          You are an experienced investor adviser AI. 
          Your task is to analyze an organization and find the most relevant competitors based on its business data. 
          Use industry, keywords, description, and location to determine relevance. 
          For each competitor, return its primary domain and a similarity score from 0 to 1 (1 meaning an exact match). 
          Focus primarily on business domain similarity; location is a secondary factor.
        `,
      },
      {
        role: 'user',
        content: `Here is the organization data:\n\n${JSON.stringify(organization, null, 2)}\n\n
        Return a list of competitors with fields: domain (string), score (0 to 1).`,
      },
    ];
  }
}
