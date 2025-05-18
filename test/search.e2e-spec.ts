import { INestApplication } from '@nestjs/common';
import { createApplication } from '../src/app';
import * as request from 'supertest';
import * as nock from 'nock';
import { AiService } from '../src/providers/ai.service';

describe('SearchController (e2e)', () => {
  let app: INestApplication;
  let aiService: AiService;
  const apolloApiUrl = 'https://api.apollo.io/api/v1';

  beforeAll(async () => {
    app = await createApplication(3003);
    aiService = app.get<AiService>(AiService);
    nock.disableNetConnect();
    nock.enableNetConnect(/(localhost|127\.0\.0\.1)/);
  });

  afterAll(async () => {
    await app.close();
    nock.cleanAll();
    nock.enableNetConnect();
  });

  beforeEach(() => {
    nock.cleanAll();
  });

  describe('/api/search (POST)', () => {
    it('should return competitors for a valid domain', async () => {
      nock(apolloApiUrl)
        .get('//organizations/enrich')
        .query(true)
        .reply(200, {
          organization: {
            id: 'org-123',
            name: 'Test Company',
            website_url: 'https://testcompany.com',
            logo_url: 'https://testcompany.com/logo.png',
            short_description: 'A test company',
            primary_domain: 'testcompany.com',
          },
        });

      jest.spyOn(aiService, 'getCompetitors').mockResolvedValueOnce([
        { domain: 'competitor1.com', score: 0.9 },
        { domain: 'competitor2.com', score: 0.8 },
      ]);

      nock(apolloApiUrl)
        .post('//organizations/bulk_enrich')
        .query(true)
        .reply(200, {
          organizations: [
            {
              id: 'comp-1',
              name: 'Competitor One',
              website_url: 'https://competitor1.com',
              logo_url: 'https://competitor1.com/logo.png',
              short_description: 'Description of competitor one',
              primary_domain: 'competitor1.com',
            },
            {
              id: 'comp-2',
              name: 'Competitor Two',
              website_url: 'https://competitor2.com',
              logo_url: 'https://competitor2.com/logo.png',
              short_description: 'Description of competitor two',
              primary_domain: 'competitor2.com',
            },
          ],
        });

      const response = await request(app.getHttpServer())
        .post('/api/search')
        .send({ searchValue: 'testcompany.com' })
        .expect(200);

      expect(response.body).toEqual({
        competitors: [
          {
            id: 'comp-1',
            name: 'Competitor One',
            score: 0.9,
            logo: 'https://competitor1.com/logo.png',
            website: 'https://competitor1.com',
            description: 'Description of competitor one',
            primaryDomain: 'competitor1.com',
          },
          {
            id: 'comp-2',
            name: 'Competitor Two',
            score: 0.8,
            logo: 'https://competitor2.com/logo.png',
            website: 'https://competitor2.com',
            description: 'Description of competitor two',
            primaryDomain: 'competitor2.com',
          },
        ],
      });
    });

    it('should return 400 for invalid domain format', async () => {
      await request(app.getHttpServer())
        .post('/api/search')
        .send({ searchValue: 'invalid-domain' })
        .expect(400);
    });

    it('should return empty competitors array when organization is not found', async () => {
      nock(apolloApiUrl).get('//organizations/enrich').query(true).reply(200, {
        organization: null,
      });

      const response = await request(app.getHttpServer())
        .post('/api/search')
        .send({ searchValue: 'nonexistent.com' })
        .expect(200);

      expect(response.body).toHaveProperty('competitors');
      expect(response.body.competitors).toEqual([]);
    });

    it('should return empty competitors array when AI returns no competitors', async () => {
      nock(apolloApiUrl)
        .get('//organizations/enrich')
        .query(true)
        .reply(200, {
          organization: {
            id: 'org-123',
            name: 'Test Company',
            website_url: 'https://testcompany.com',
            logo_url: 'https://testcompany.com/logo.png',
            short_description: 'A test company',
            primary_domain: 'testcompany.com',
          },
        });

      jest.spyOn(aiService, 'getCompetitors').mockResolvedValueOnce([]);

      const response = await request(app.getHttpServer())
        .post('/api/search')
        .send({ searchValue: 'testcompany.com' })
        .expect(200);

      expect(response.body).toHaveProperty('competitors');
      expect(response.body.competitors).toEqual([]);
    });
  });
});
