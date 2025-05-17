import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApolloEnrichOrganizationResponse, ApolloOrganization } from './apollo.dto';

@Injectable()
export class ApolloService {
  private readonly apiUrl = 'https://api.apollo.io/api/v1/';

  constructor(private readonly configService: ConfigService) {}

  public async enrichOrganization(domain: string): Promise<ApolloOrganization> {
    const apiCall = await fetch(`${this.apiUrl}/organizations/enrich?domain=${domain}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    const response = (await apiCall.json()) as unknown as ApolloEnrichOrganizationResponse;
    return response.organization;
  }

  private getHeaders() {
    const apiKey = this.configService.get<string>('APOLLO_API_KEY');
    return {
      accept: 'application/json',
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    };
  }
}
