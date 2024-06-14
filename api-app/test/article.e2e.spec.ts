import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { dropDb, seedArticles, seedLogin, seedLoginAdmin, seedTag, seedUser } from "./init";
import * as path from 'path';

describe('Articles controller (e2e)', () => {
  let app: INestApplication;

  let httpClient: request.SuperTest<request.Test>;

  let accessTokenAdmin: string, refreshTokenAdmin: string, accessToken1: string, accessToken2: string;

  let userData1, userData2;

  let article1, article2;

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
    const userSeedData = await seedUser(httpClient);

    userData1 = userSeedData[0].body.data;
    userData2 = userSeedData[1].body.data;


    const user1Login = await seedLogin(httpClient, userData1.email);
    accessToken1 = user1Login.accessToken;

    const user2Login = await seedLogin(httpClient, userData2.email);
    accessToken2 = user2Login.accessToken;

    accessTokenAdmin = dataAdmin.accessToken;

    const tagPromise = await seedTag(httpClient, accessTokenAdmin);

    await tagIds.push(tagPromise[0].body.data.id);
    await tagIds.push(tagPromise[1].body.data.id);

    const articlePromise = await seedArticles(httpClient, accessToken1, tagIds);

    article1 = articlePromise[0].body.data;
    article2 = articlePromise[1].body.data;

  });

  afterAll(async () => {
    await Promise.all([app.close()]);
  });

  it('/api/v1/articles/ Create Articles (Post) unsuccess: file not is a image', async () => {
    const articleData = {
      title: "test create article",
      description: "Description",
      keyword: "keyword",
      body: "Main content",
      tag: tagIds.join(',')
    }

    const response = await httpClient
      .post('/api/v1/articles')
      .set('Authorization', accessToken1)
      .set('Content-Type', 'multipart/form-data')
      .attach('thumbnail', path.resolve(__dirname, './test.txt'))
      .field('title', articleData.title)
      .field('description', articleData.description)
      .field('keyword', articleData.keyword)
      .field('body', articleData.body)
      .field('tag', articleData.tag)
      .expect(400);
  });

  it('/api/v1/articles/ Create Articles (Post) success', async () => {
    const articleData = {
      title: "test create article",
      description: "Description",
      keyword: "keyword",
      body: "Main content",
      tag: tagIds.join(',')
    }

    const response = await httpClient
      .post('/api/v1/articles')
      .set('Authorization', accessToken1)
      .set('Content-Type', 'multipart/form-data')
      .attach('thumbnail', path.resolve(__dirname, './test.jpg'))
      .field('title', articleData.title)
      .field('description', articleData.description)
      .field('keyword', articleData.keyword)
      .field('body', articleData.body)
      .field('tag', articleData.tag)
      .expect(201);

    expect(response.body.data.title).toEqual(articleData.title);
    expect(response.body.data.description).toEqual(articleData.description);
    expect(response.body.data.keyword).toEqual(articleData.keyword);
    expect(response.body.data.body).toEqual(articleData.body);
    expect(response.body.data.author.id).toEqual(userData1.id);
  });

  it('/api/v1/articles/ Editor upload: success', async () => {
    const response = await httpClient
      .post('/api/v1/articles/cke-upload')
      .set('Authorization', accessToken1)
      .attach("image", path.resolve(__dirname, './test.jpg'))
      .expect(201)

    expect(response.body).toBeDefined();
  })

  it('/api/v1/articles/ Find All Articles (Get) success with search', async () => {
    const title = "test create article";

    const response = await httpClient
      .get('/api/v1/articles')
      .set('Authorization', accessToken1)
      .query({
        itemPerPage: 10,
        page: 1,
        search: title,
      })
      .expect(200);

    expect(response.body.data[0].title).toEqual(title);
  });

  it('/api/v1/articles/ Get detail Articles (get) unsuccess: Id not found', async () => {
    const response = await httpClient
      .get(`/api/v1/articles/${-1}`)
      .expect(404);
  });

  it('/api/v1/articles/ Get detail Articles (get) success', async () => {
    const response = await httpClient
      .get(`/api/v1/articles/${article1.id}`)
      .expect(200);

    expect(response.body.data.title).toEqual(article1.title);
    expect(response.body.data.view).toEqual(1);
  });


  it('/api/v1/articles/ Find All Articles (Get) success with search -> no list', async () => {

    const response = await httpClient
      .get('/api/v1/articles')
      .set('Authorization', accessToken1)
      .query({
        itemPerPage: 10,
        page: 1,
        search: "fsdfsdfsdfds",
      })
      .expect(200);
    expect(response.body.data.length).toEqual(0);
  });


  it('/api/v1/articles/ Find All Articles (Get) success with userId', async () => {
    const title = "test article edit";

    const response = await httpClient
      .get('/api/v1/articles')
      .query({
        itemPerPage: 10,
        page: 1,
        userId: userData1.id,
      })
      .expect(200);

    expect(response.body.data.length).toEqual(3);
  });


  it('/api/v1/articles/ Find All Articles (Get) success with userId -> no list', async () => {

    const response = await httpClient
      .get('/api/v1/articles')
      .query({
        itemPerPage: 10,
        page: 1,
        userId: userData2.id,
      })
      .expect(200);

    expect(response.body.data.length).toEqual(0);
  });

  it('/api/v1/articles/ Get count Articles (Get) success', async () => {

    const response = await httpClient
      .get('/api/v1/articles/count')
      .expect(200)

    expect(response.body.data).toEqual(3);
  });

  it('/api/v1/articles/ Edit Articles (Put) unsuccess: Permission denied', async () => {
    const title = "test article edit 2";

    const response = await httpClient
      .put(`/api/v1/articles/${article1.id}`)
      .set('Authorization', accessToken2)
      .set('Content-Type', 'multipart/form-data')
      .field('title', title)
      .field('tag', tagIds.join(','))
      .expect(403);
  });

  it('/api/v1/articles/ Edit Articles (Put) unsuccess: Unauthorized', async () => {
    const title = "test article edit 2";

    const response = await httpClient
      .put(`/api/v1/articles/${article1.id}`)
      .set('Content-Type', 'multipart/form-data')
      .field('title', title)
      .field('tag', tagIds.join(','))
      .expect(401);
  });

  it('/api/v1/articles/ Edit Articles (Put) success', async () => {
    const title = "test article edit";

    const response = await httpClient
      .put(`/api/v1/articles/${article1.id}`)
      .set('Authorization', accessToken1)
      .set('Content-Type', 'multipart/form-data')
      .field('title', title)
      .field('tag', tagIds.join(','))
      .expect(200);

    expect(response.body.data.title).toEqual(title);
  });
});