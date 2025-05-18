export interface Organization {
  readonly id: string;
  readonly name: string;
  readonly website: string;
  readonly logo: string;
  readonly description: string;
  readonly industry: string;
  readonly keywords: string[];
  readonly industries: string[];
  readonly city: string;
  readonly state: string;
  readonly country: string;
  readonly seoDescription: string;
  readonly primaryDomain: string;
}

export interface Competitor {
  readonly domain: string;
  readonly score: number;
}

export interface AiProvider {
  isActive(): boolean;
  getCompetitors(organization: Organization): Promise<Competitor[]>;
}
