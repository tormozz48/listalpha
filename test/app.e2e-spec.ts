import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createApplication } from '../src/app';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createApplication(3002);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/status (GET)', () => {
    it('should return status ok', () => {
      return request(app.getHttpServer()).get('/api/status').expect(200).expect({ status: 'ok' });
    });
  });
});
