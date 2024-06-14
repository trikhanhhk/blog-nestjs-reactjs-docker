import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { dropDb, seedArticles, seedLogin, seedLoginAdmin, seedSeries, seedTag, seedUser } from "./init";

describe('Series controller (e2e)', () => {
  let app: INestApplication;

  let httpClient: request.SuperTest<request.Test>;

  let accessTokenAdmin: string, accessToken1: string, accessToken2: string;

  let userData1, userData2, article1, article2, series1, series2;

  let tagIds = [];
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    httpClient = request(app.getHttpServer()) as unknown as request.SuperTest<request.Test>;

    await dropDb();
    const dataAdmin = await seedLoginAdmin(httpClient);
    accessTokenAdmin = dataAdmin.accessToken;

    const userSeedData = await seedUser(httpClient);
    userData1 = userSeedData[0].body.data;
    userData2 = userSeedData[1].body.data;
    const user1Login = await seedLogin(httpClient, userData1.email);
    accessToken1 = user1Login.accessToken;
    const user2Login = await seedLogin(httpClient, userData2.email);
    accessToken2 = user2Login.accessToken;

    const tagPromise = await seedTag(httpClient, accessTokenAdmin);
    await tagIds.push(tagPromise[0].body.data.id);
    await tagIds.push(tagPromise[1].body.data.id);

    const articlePromise = await seedArticles(httpClient, accessToken1, tagIds);
    article1 = articlePromise[0].body.data;
    article2 = articlePromise[1].body.data;

    const seriesPromise = await seedSeries(httpClient, accessToken1);
    series1 = seriesPromise[0].body.data;
    series2 = seriesPromise[1].body.data;
  });

  afterAll(async () => {
    await Promise.all([app.close()]);
  });

  it('/api/v1/series (Post) Create series unsuccess: no title', async () => {
    const response = await httpClient
      .post('/api/v1/series/')
      .set('Authorization', accessToken1)
      .send({
        description: "Series 2 description"
      })
      .expect(400)
  })

  it('/api/v1/series (Post) Create series unsuccess: empty', async () => {
    const response = await httpClient
      .post('/api/v1/series/')
      .set('Authorization', accessToken1)
      .expect(400)
  });

  it('/api/v1/series (Post) Create series unsuccess: Unauthorized', async () => {
    const response = await httpClient
      .post('/api/v1/series/')
      .send({
        title: "title",
        description: "Series 2 description"
      })
      .expect(401)
  })

  it('/api/v1/series (Post) Create series success', async () => {
    const seriesData = {
      title: "Series new",
      description: "Series new description"
    }

    const response = await httpClient
      .post('/api/v1/series/')
      .set('Authorization', accessToken1)
      .send(seriesData)
      .expect(201);

    expect(response.body.data.title).toEqual(seriesData.title);
    expect(response.body.data.description).toEqual(seriesData.description);
  });

  it('/api/v1/series (Get) get series success', async () => {

    const response = await httpClient
      .get(`/api/v1/series/${series1.id}`)
      .set('Authorization', accessToken1)
      .expect(200);

    expect(response.body.data.view).toEqual(1);
    expect(response.body.data.id).toEqual(series1.id);
    expect(response.body.data.title).toEqual(series1.title);
    expect(response.body.data.description).toEqual(series1.description);
  });

  it('/api/v1/series (Get) get series unsuccess', async () => {

    await httpClient
      .get(`/api/v1/series/${-1}`)
      .set('Authorization', accessToken1)
      .expect(404);
  });


  it('/api/v1/series (Get) get list series success: 0 result', async () => {
    //no userId
    const response = await httpClient
      .get(`/api/v1/series`)
      .query({ userId: userData1.id })
      .set('Authorization', accessToken1)
      .expect(200);

    expect(response.body.data.length).toEqual(3);
  });


  it('/api/v1/series (Get) get list series success: 3 result', async () => {
    //with userId
    const response = await httpClient
      .get(`/api/v1/series`)
      .set('Authorization', accessToken1)
      .expect(200);

    expect(response.body.data.length).toEqual(0);
  });


  it('/api/v1/series (Get) get list series success', async () => {

    const response = await httpClient
      .get(`/api/v1/series`)
      .set('Authorization', accessToken1)
      .expect(200);

    expect(response.body.data.length).toEqual(0);
  });

  it('/api/v1/series (Get) get count series success', async () => {

    const response = await httpClient
      .get(`/api/v1/series/count`)
      .expect(200);

    expect(response.body.data).toEqual(3);
  });

  it('/api/v1/series (Get) checkVote', async () => {

    const response = await httpClient
      .get(`/api/v1/series/${series1.id}/vote`)
      .set('Authorization', accessToken2)
      .expect(200);

    expect(response.body.data).toEqual(null);
  });


  it('/api/v1/series (Put) edit series unsuccess: Unauthorized', async () => {
    const seriesData = {
      title: "Series new edited",
      description: "Series new description edited"
    }

    await httpClient
      .put(`/api/v1/series/${series1.id}`)
      .send(seriesData)
      .expect(401);
  });

  it('/api/v1/series (Put) edit series unsuccess: Permission denied', async () => {
    const seriesData = {
      title: "Series new edited",
      description: "Series new description edited"
    }

    await httpClient
      .put(`/api/v1/series/${series1.id}`)
      .set('Authorization', accessToken2)
      .send(seriesData)
      .expect(403);
  });

  it('/api/v1/series (Put) edit series success', async () => {
    const seriesData = {
      title: "Series new edited",
      description: "Series new description edited"
    }

    const response = await httpClient
      .put(`/api/v1/series/${series1.id}`)
      .set('Authorization', accessToken1)
      .send(seriesData)
      .expect(200);

    expect(response.body.data.id).toEqual(series1.id);
    expect(response.body.data.title).toEqual(seriesData.title);
    expect(response.body.data.description).toEqual(seriesData.description);
  });

  it('/api/v1/series (Delete) delete series unsuccess: Permission denied', async () => {
    const response = await httpClient
      .delete(`/api/v1/series/${series2.id}`)
      .set('Authorization', accessToken2)
      .expect(403);
  });

  it('/api/v1/series (Delete) delete series', async () => {
    const response = await httpClient
      .delete(`/api/v1/series/${series2.id}`)
      .set('Authorization', accessToken1)
      .expect(200);
    expect(response.body.data).toBeDefined();

    const checkDelete = await httpClient
      .get(`/api/v1/user/${series2.id}`)
      .expect(404);
  });

});