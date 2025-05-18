import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiProvider, Competitor, Organization } from './types';
import { CoreMessage, generateObject, Message } from 'ai';
import { z } from 'zod';
import { google } from '@ai-sdk/google';

const CompetitorSchema = z.array(
  z
    .object({
      domain: z.string(),
      score: z.number().min(0).max(1),
    })
    .strict(),
);

@Injectable()
export class GoogleAIService implements AiProvider {
  constructor(private readonly configService: ConfigService) {}

  public isActive(): boolean {
    return Boolean(this.configService.get<string>('GOOGLE_GENERATIVE_AI_API_KEY'));
  }

  public async getCompetitors(organization: Organization): Promise<Competitor[]> {
    const result = await generateObject({
      model: google('gemini-2.0-flash-exp', {
        structuredOutputs: true,
      }),
      schema: CompetitorSchema,
      messages: this.getMessages(organization),
    });
    return result.object.map((competitor) => ({
      domain: competitor.domain,
      score: competitor.score,
    }));
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
