import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface ApolloOrganization {
  readonly id: string;
  readonly name: string;
  readonly website: string;
  readonly logo: string;
  readonly description: string;
}

interface ApolloAPIEnrichOrganizationResponse {
  readonly organization: Readonly<{
    id: string;
    name: string;
    website_url: string;
    logo_url: string;
    short_description: string;
  }>;
}

@Injectable()
export class ApolloService {
  private readonly apiUrl = 'https://api.apollo.io/api/v1/';

  constructor(private readonly configService: ConfigService) {}

  public async enrichOrganization(domain: string): Promise<ApolloOrganization> {
    const apiCall = await fetch(`${this.apiUrl}/organizations/enrich?domain=${domain}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    const response = (await apiCall.json()) as unknown as ApolloAPIEnrichOrganizationResponse;
    return this.convertToOrganizationModel(response.organization);
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

  private convertToOrganizationModel(
    organization: ApolloAPIEnrichOrganizationResponse['organization'],
  ): ApolloOrganization {
    return {
      id: organization.id,
      name: organization.name,
      description: organization.short_description,
      logo: organization.logo_url,
      website: organization.website_url,
    };
  }
}
