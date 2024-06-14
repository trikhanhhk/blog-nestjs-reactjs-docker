import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { dropDb, seedLogin, seedLoginAdmin, seedUser } from './init';


describe('Auth controller (e2e)', () => {
  let app: INestApplication;

  let httpClient: request.SuperTest<request.Test>;

  let accessTokenAdmin: string, refreshTokenAdmin: string, accessToken1: string, accessToken2: string;

  let userData1, userData2;

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

    accessTokenAdmin = dataAdmin.accessToken
  });

  afterAll(async () => {
    await Promise.all([app.close()]);
  });

  it('/user (Get) [get list user success]', async () => {
    const response = await httpClient
      .get('/api/v1/user')
      .set('Authorization', accessTokenAdmin)
      .expect(HttpStatus.OK);

    expect(response.body.data).toBeDefined();
    expect(response.body.pagination).toBeDefined();
  });

  it('/user (Get) [get detail user]', async () => {
    const response = await httpClient
      .get(`/api/v1/user/${userData1.id}`)
      .expect(HttpStatus.OK);

    expect(response.body.data).toBeDefined();
    expect(response.body.data.email).toEqual(userData1.email);
  });

  it('/user (Get) [get count user success 200]', async () => {
    const response = await httpClient
      .get('/api/v1/user/count')
      .set('Authorization', accessTokenAdmin)
      .expect(HttpStatus.OK);

    expect(response.body.data).toBeDefined();
  });

  it('/user (Post) follow user', async () => {
    const response = await httpClient
      .post(`/api/v1/user/${userData2.id}/follow?type=follow`)
      .set('Authorization', accessToken1)
      .expect(201)

    expect(response.body.data).toBeDefined();
    expect(response.body.data.type).toEqual('follow');
  })

  it('/user (Get) checkUserFollow', async () => {
    const response = await httpClient
      .post(`/api/v1/user/${userData2.id}/follow`)
      .query({ type: "follow" })
      .set('Authorization', accessToken1)
      .expect(201)

    expect(response.body.data).toBeDefined();
    expect(response.body.data.type).toEqual("follow");
  });

  it('/user (Put) updatePassword success', async () => {
    const update = await httpClient
      .put(`/api/v1/user/${userData1.id}/updatePassword`)
      .send({ newPassword: "Khanhnt@2k", oldPassword: "Khanh@123" })
      .set('Authorization', accessToken1)
      .expect(200);

    expect(update.body.data).toBeDefined();

    const login = await httpClient
      .post(`/api/v1/auth/login`)
      .send({ email: update.body.data.email, password: 'Khanhnt@2k' })
      .expect(201);
  });

  it('/user (Put) updatePassword unsuccess: oldPassword incorrect', async () => {
    const update = await httpClient
      .put(`/api/v1/user/${userData1.id}/updatePassword`)
      .send({ newPassword: "Khanhnt@2k", oldPassword: "Incorrect Password" })
      .set('Authorization', accessToken1)
      .expect(401);
  });

  it('/user (Delete) deleteUser', async () => {
    const response = await httpClient
      .delete(`/api/v1/user/${userData2.id}`)
      .set('Authorization', accessTokenAdmin)
      .expect(200);
    expect(response.body.data).toBeDefined();

    const checkDelete = await httpClient
      .get(`/api/v1/user/${userData2.id}`)
      .expect(404);
  });

  it('/user (Delete) multiple delete', async () => {
    const response = await httpClient
      .delete(`/api/v1/user`)
      .query({ delete_ids: `${userData1.id},${userData2.id}` })
      .set('Authorization', accessTokenAdmin)
      .expect(200);

    expect(response.body.data).toBeDefined();

    await httpClient
      .get(`/api/v1/user/${userData1.id}`)
      .expect(404)

    await httpClient
      .get(`/api/v1/user/${userData2.id}`)
      .expect(404)
  });

});

