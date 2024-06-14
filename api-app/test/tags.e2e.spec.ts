import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { dropDb, seedLogin, seedLoginAdmin, seedTag, seedUser } from "./init";

describe('Articles controller (e2e)', () => {
  let app: INestApplication;

  let httpClient: request.SuperTest<request.Test>;

  let accessTokenAdmin: string, refreshTokenAdmin: string, accessToken1: string, accessToken2: string;

  let userData1, userData2;

  let tagIds = [];
  let tagData1, tagData2;
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

    accessTokenAdmin = dataAdmin.accessToken;

    const tagPromise = await seedTag(httpClient, accessTokenAdmin);

    tagData1 = tagPromise[0].body.data;
    tagData2 = tagPromise[1].body.data;

    tagIds.push(tagData1.id);
    tagIds.push(tagData2.id);

  });

  afterAll(async () => {
    await Promise.all([app.close()]);
  });

  it('/api/v1/tags Create tag (Post) success', async () => {
    const tagData1 = {
      tagName: 'Tag test create 1',
      description: 'description 1',
      tagType: 1,
    }

    const response = await httpClient
      .post('/api/v1/tags')
      .set('Authorization', accessTokenAdmin)
      .send(tagData1)
      .expect(201);

    console.log('Khanhnt -<>', response.body);

    expect(response.body.data.tagName).toEqual(tagData1.tagName);
    expect(response.body.data.description).toEqual(tagData1.description);
    expect(response.body.data.tagType).toEqual(tagData1.tagType);
  });

  it('/api/v1/tags Create tag (Post) unsuccess: tagName empty', async () => {
    const tagData1 = {
      description: 'description 1',
      tagType: 1,
    }

    const response = await httpClient
      .post('/api/v1/tags')
      .set('Authorization', accessTokenAdmin)
      .send(tagData1)
      .expect(400);
  });


  it('/api/v1/tags Create tag (Post) unsuccess: data empty', async () => {
    const tagData1 = {

    }

    const response = await httpClient
      .post('/api/v1/tags')
      .set('Authorization', accessTokenAdmin)
      .send(tagData1)
      .expect(400);
  });



  it('/api/v1/tags Find All tag (Get) success', async () => {
    const query = {
      search: tagData1.tagName,
    }

    const response = await httpClient
      .get('/api/v1/tags')
      .query(query)
      .expect(200);

    expect(response.body.data.length).toEqual(1);
    expect(response.body.data[0].tagName).toEqual(query.search);
  });


  it('/api/v1/tags Get tag by id (Get) success', async () => {
    const id = tagData1.id;

    const response = await httpClient
      .get(`/api/v1/tags/${id}`)
      .expect(200);

    expect(response.body.data.id).toEqual(id);
  });

  it('/api/v1/tags Get tag by id (Get) unsuccess: Id not found', async () => {
    const invalidId = -1;

    const response = await httpClient
      .get(`/api/v1/tags/${invalidId}`)
      .expect(404);
  })

  it('/api/v1/tags Edit tag (Put) success', async () => {
    const dataEdit = {
      tagName: "Tag edited 1",
      description: "Description edited 1",
      tagType: 2
    }

    const response = await httpClient
      .put(`/api/v1/tags/${tagData1.id}`)
      .set('Authorization', accessTokenAdmin)
      .send(dataEdit)
      .expect(200)

    expect(response.body.data.tagName).toEqual(dataEdit.tagName);
    expect(response.body.data.tagType).toEqual(dataEdit.tagType);
    expect(response.body.data.description).toEqual(dataEdit.description);
  });

  it('/api/v1/tags Edit tag (Put) unsuccess: Forbidden', async () => {
    const dataEdit = {
      tagName: "Tag edited 1",
      description: "Description edited 1",
      tagType: 2
    }

    const response = await httpClient
      .put(`/api/v1/tags/${tagData1.id}`)
      .set('Authorization', accessToken1)
      .send(dataEdit)
      .expect(403)
  });

  it('/api/v1/tags Edit tag (Put) unsuccess: Permission denied', async () => {
    const dataEdit = {
      tagName: "Tag edited 1",
      description: "Description edited 1",
      tagType: 2
    }

    const response = await httpClient
      .put(`/api/v1/tags/${tagData1.id}`)
      .set('Authorization', accessToken1)
      .send(dataEdit)
      .expect(403)
  });

  it('/api/v1/tags delete multiple tag (Delete) unsuccess: Permission denied', async () => {

    const response = await httpClient
      .delete(`/api/v1/tags`)
      .set('Authorization', accessToken1)
      .query({ ids: tagIds.join(',') })
      .expect(403)

    const responseCheckDelete = await httpClient
      .get('/api/v1/tags')
      .expect(200);

    expect(responseCheckDelete.body.data.length).toEqual(3);
  });

  it('/api/v1/tags delete multiple tag (Delete) unsuccess: Unauthorized', async () => {

    const response = await httpClient
      .delete(`/api/v1/tags`)
      .query({ ids: tagIds.join(',') })
      .expect(401)

    const responseCheckDelete = await httpClient
      .get('/api/v1/tags')
      .expect(200);

    expect(responseCheckDelete.body.data.length).toEqual(3);
  });


  it('/api/v1/tags delete multiple tag (Delete) success', async () => {

    const response = await httpClient
      .delete(`/api/v1/tags`)
      .set('Authorization', accessTokenAdmin)
      .query({ ids: tagIds.join(',') })
      .expect(200)

    const responseCheckDelete = await httpClient
      .get('/api/v1/tags')
      .expect(200);

    expect(responseCheckDelete.body.data.length).toEqual(1);
  });

  it('/api/v1/tags delete one tag (Delete) unsuccess: Unauthorized', async () => {
    const newTag = await seedTag(httpClient, accessTokenAdmin);
    tagData1 = newTag[0].body.data;
    tagData2 = newTag[1].body.data;

    const response = await httpClient
      .delete(`/api/v1/tags/${tagData1.id}`)
      .expect(401)

    const responseCheckDelete = await httpClient
      .get('/api/v1/tags')
      .expect(200);

    expect(responseCheckDelete.body.data.length).toEqual(3);
  });

  it('/api/v1/tags delete one tag (Delete) unsuccess: Permission denied', async () => {
    const response = await httpClient
      .delete(`/api/v1/tags/${tagData1.id}`)
      .set('Authorization', accessToken1)
      .expect(403)

    const responseCheckDelete = await httpClient
      .get('/api/v1/tags')
      .expect(200);

    expect(responseCheckDelete.body.data.length).toEqual(3);
  });

  it('/api/v1/tags delete one tag (Delete) success', async () => {
    const response = await httpClient
      .delete(`/api/v1/tags/${tagData1.id}`)
      .set('Authorization', accessTokenAdmin)
      .expect(200)

    const responseCheckDelete = await httpClient
      .get(`/api/v1/tags/${tagData1.id}`)
      .expect(404);
  });

});