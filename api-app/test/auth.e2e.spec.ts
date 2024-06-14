import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { dropDb, seedUser } from './init';
import { User } from 'src/user/user.entity';
import { AppModule } from 'src/app.module';
import { Test, TestingModule } from '@nestjs/testing';

describe('Auth controller (e2e)', () => {
  let app: INestApplication;

  let httpClient: request.SuperTest<request.Test>;

  let accessToken = '';

  const registerForm = {
    email: 'trikhanhtk0038@gmail.com',
    password: 'Khanhnt@123',
    first_name: 'tk4',
    last_name: 'abc4',
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    httpClient = request(app.getHttpServer()) as unknown as request.SuperTest<request.Test>;

    await dropDb();
    await seedUser(httpClient);

  });

  afterEach(async () => {
    await Promise.all([app.close()]);
  });


  it('/auth/register (Post) [register success]', async () => {
    const response = await httpClient
      .post('/api/v1/auth/register')
      .send(registerForm)
      .expect(201);

    expect(response.body.data).toBeDefined();
    expect(response.body.data.email).toEqual(registerForm.email);
    expect(response.body.data.first_name).toEqual(registerForm.first_name);
    expect(response.body.data.last_name).toEqual(registerForm.last_name);
  });

  it('/auth/register (Post) [register unsuccess: duplicate email]', async () => {
    return httpClient
      .post('/api/v1/auth/register')
      .send({
        ...registerForm,
        email: "trikhanhtk0038+test2@gmail.com"
      })
      .expect(409);
  });

  it('/auth/register (Post) [register unsuccess: email not valid]', async () => {
    return await httpClient
      .post('/api/v1/auth/register')
      .send({
        ...registerForm,
        email: "invalid email"
      })
      .expect(400);
  });

  it('/auth/register (Post) [register unsuccess: pass too short]', async () => {
    const response = await httpClient
      .post('/api/v1/auth/register')
      .send({
        ...registerForm,
        password: "12f"
      })
      .expect(400);
  });


  it('/auth/register (Post) [register unsuccess: data empty]', async () => {
    const response = await httpClient
      .post('/api/v1/auth/register')
      .send({})
      .expect(400);
  });

  it('/auth/login (Post) [login success]', async () => {
    const response = await httpClient
      .post('/api/v1/auth/login')
      .send({ email: "trikhanhtk0038+test2@gmail.com", password: "Khanh@123" })
      .expect(201);

    expect(response.body.data.accessToken).toBeDefined();
  });

  it('/auth/login (Post) [login unsuccess: password invalid]', async () => {
    const response = await httpClient
      .post('/api/v1/auth/login')
      .send({ email: "trikhanhtk0038+test2@gmail.com", password: 'invalidPassword' })
      .expect(401);
  });
});

