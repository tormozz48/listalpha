export interface ApolloOrganization {
  readonly id: string;
  readonly name: string;
  readonly website_url: string;
  readonly logo_url: string;
  readonly short_description: string;
}

export interface ApolloEnrichOrganizationResponse {
  readonly organization: ApolloOrganization;
}
