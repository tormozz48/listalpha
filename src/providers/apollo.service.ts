import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Organization } from './types';

interface ApolloAPIOrganizationItem {
  readonly id: string;
  readonly name: string;
  readonly website_url: string;
  readonly logo_url: string;
  readonly short_description: string;
  readonly primary_domain: string;
  readonly industry: string;
  readonly keywords: string[];
  readonly industries: string[];
  readonly city: string;
  readonly state: string;
  readonly country: string;
  readonly seo_description: string;
}

interface ApolloAPIEnrichOrganizationResponse {
  readonly organization: Readonly<ApolloAPIOrganizationItem>;
}

interface ApolloAPIBulkEnrichOrganizationsResponse {
  readonly organizations: Readonly<ApolloAPIOrganizationItem>[];
}

@Injectable()
export class ApolloService {
  private readonly apiUrl = 'https://api.apollo.io/api/v1/';
  private readonly logger = new Logger(ApolloService.name);

  constructor(private readonly configService: ConfigService) {}

  public async enrichOrganization(domain: string): Promise<Organization | null> {
    const apiCall = await fetch(`${this.apiUrl}/organizations/enrich?domain=${domain}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    const response = (await apiCall.json()) as unknown as ApolloAPIEnrichOrganizationResponse;
    if (!response.organization) {
      return null;
    }
    this.logger.log(`Organization enriched: name = ${response.organization.name}`);
    return this.convertToOrganizationModel(response.organization);
  }

  public async bulkEnrichOrganizations(domains: string[]): Promise<Organization[]> {
    const queryParams = domains.map((domain) => `domains[]=${domain}`).join('&');
    const apiCall = await fetch(`${this.apiUrl}/organizations/bulk_enrich?${queryParams}`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    const response = (await apiCall.json()) as unknown as ApolloAPIBulkEnrichOrganizationsResponse;
    this.logger.log(`Organizations enriched: count = ${response.organizations.length}`);
    return response.organizations.map(this.convertToOrganizationModel.bind(this));
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
  ): Organization {
    return {
      id: organization.id,
      name: organization.name,
      description: organization.short_description,
      logo: organization.logo_url,
      website: organization.website_url,
      industry: organization.industry,
      keywords: organization.keywords,
      industries: organization.industries,
      city: organization.city,
      state: organization.state,
      country: organization.country,
      seoDescription: organization.seo_description,
      primaryDomain: organization.primary_domain,
    };
  }
}
