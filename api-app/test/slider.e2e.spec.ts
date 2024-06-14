import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { dropDb, seedLoginAdmin, seedSlider } from "./init";
import * as path from "path";

describe('slider controller (e2e)', () => {
  let app: INestApplication;

  let httpClient: request.SuperTest<request.Test>;

  let accessTokenAdmin: string;

  let slider1, slider2;
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

    const sliderPromise = await seedSlider(httpClient, accessTokenAdmin);
    slider1 = sliderPromise[0].body.data;
    slider2 = sliderPromise[1].body.data;
  });

  afterAll(async () => {
    await Promise.all([app.close()]);
  });

  it('/api/v1/slider (Post) Create slider unsuccess: empty', async () => {
    const response = await httpClient
      .post('/api/v1/slider/')
      .set('Content-Type', 'multipart/form-data')
      .set('Authorization', accessTokenAdmin)
      .expect(400)
  });

  it('/api/v1/slider (Post) Create slider unsuccess: Unauthorized', async () => {
    const response = await httpClient
      .post('/api/v1/slider/')
      .set('Content-Type', 'multipart/form-data')
      .expect(401)
  });

  it('/api/v1/slider (Post) Create slider success', async () => {
    const data = {
      name: "slider 1",
      description: "Description 1",
      link: "http://view.demo.com",
      status: "off"
    }

    const response = await httpClient
      .post('/api/v1/slider')
      .set('Authorization', accessTokenAdmin)
      .set('Content-Type', 'multipart/form-data')
      .field('name', 'slider 1')
      .field('description', 'Description 1')
      .field('link', 'http://view.demo.com')
      .field('status', 'off')
      .attach("slideImage", path.resolve(__dirname, './test.jpg'))
      .expect(201);

    expect(response.body.data.name).toEqual(data.name);
    expect(response.body.data.description).toEqual(data.description);
    expect(response.body.data.link).toEqual(data.link);
    expect(response.body.data.status).toEqual(data.status);
  });

  it('/api/v1/slider (Get) Get slider list (status all) success', async () => {
    const response = await httpClient
      .get('/api/v1/slider/')
      .set('Authorization', accessTokenAdmin)
      .expect(200)

    expect(response.body.data.length).toEqual(3);
  });

  it('/api/v1/slider (Get) Get slider list (status all) unsuccess: Unauthorized', async () => {
    await httpClient
      .get('/api/v1/slider/')
      .expect(401)
  });

  it('/api/v1/slider (Get) Get slider list (status=on) success', async () => {
    const response = await httpClient
      .get('/api/v1/slider/carousel')
      .expect(200)

    expect(response.body.data.length).toEqual(2);
  });

  it('/api/v1/slider (Get) Get detail slider success', async () => {
    const response = await httpClient
      .get(`/api/v1/slider/${slider1.id}`)
      .set('Authorization', accessTokenAdmin)
      .expect(200)

    expect(response.body.data.id).toEqual(slider1.id);
    expect(response.body.data.name).toEqual(slider1.name);
    expect(response.body.data.description).toEqual(slider1.description);
    expect(response.body.data.link).toEqual(slider1.link);
    expect(response.body.data.status).toEqual(slider1.status);
  });

  it('/api/v1/slider (Get) Get detail slider unsuccess: not found', async () => {
    await httpClient
      .get(`/api/v1/slider/${-1}`)
      .set('Authorization', accessTokenAdmin)
      .expect(404)
  });

  it('/api/v1/slider (Put) Update slider success', async () => {
    const data = {
      name: "slider 1 edited",
      description: "Description 1 edited",
      link: "http://view.demo.com.edit",
      status: "on"
    }

    const response = await httpClient
      .put(`/api/v1/slider/${slider1.id}`)
      .set('Authorization', accessTokenAdmin)
      .set('Content-Type', 'multipart/form-data')
      .field('name', data.name)
      .field('description', data.description)
      .field('link', data.link)
      .field('status', data.status)
      .attach("slideImage", path.resolve(__dirname, './test.jpg'))
      .expect(200);

    expect(response.body.data.id).toEqual(slider1.id);
    expect(response.body.data.name).toEqual(data.name);
    expect(response.body.data.description).toEqual(data.description);
    expect(response.body.data.link).toEqual(data.link);
    expect(response.body.data.status).toEqual(data.status);
  });

  it('/api/v1/slider (Put) Update slider unsuccess: Unauthorized', async () => {
    const data = {
      name: "slider 1 edited",
      description: "Description 1 edited",
      link: "http://view.demo.com.edit",
      status: "on"
    }

    await httpClient
      .put(`/api/v1/slider/${slider1.id}`)
      .set('Content-Type', 'multipart/form-data')
      .field('name', data.name)
      .field('description', data.description)
      .field('link', data.link)
      .field('status', data.status)
      .attach("slideImage", path.resolve(__dirname, './test.jpg'))
      .expect(401);
  });

  it('/api/v1/slider (Put) Update status slider success', async () => {
    const responseOff = await httpClient
      .put(`/api/v1/slider/${slider1.id}/status`)
      .set('Authorization', accessTokenAdmin)
      .expect(200);

    expect(responseOff.body.data.status).toEqual("off");

    const responseOn = await httpClient
      .put(`/api/v1/slider/${slider1.id}/status`)
      .set('Authorization', accessTokenAdmin)
      .expect(200);

    expect(responseOn.body.data.status).toEqual("on");
  });

  it('/api/v1/slider (Put) Update status slider unsuccess: not found', async () => {
    const responseOff = await httpClient
      .put(`/api/v1/slider/${-1}/status`)
      .set('Authorization', accessTokenAdmin)
      .expect(404);
  });

  it('/api/v1/slider (Delete) delete multiple slider success', async () => {
    const response = await httpClient
      .delete(`/api/v1/slider`)
      .set('Authorization', accessTokenAdmin)
      .query({ ids: `${slider1.id},${slider2.id}` })
      .expect(200);

    await httpClient
      .get(`/api/v1/slider/${slider1.id}`)
      .set('Authorization', accessTokenAdmin)
      .expect(404)

    await httpClient
      .get(`/api/v1/slider/${slider2.id}`)
      .set('Authorization', accessTokenAdmin)
      .expect(404)

    const sliderPromise = await seedSlider(httpClient, accessTokenAdmin);
    slider1 = sliderPromise[0].body.data;
    slider2 = sliderPromise[1].body.data;
  });

  it('/api/v1/slider (Delete) delete one slider success', async () => {
    await httpClient
      .delete(`/api/v1/slider/${slider1.id}`)
      .set('Authorization', accessTokenAdmin)
      .expect(200);

    await httpClient
      .get(`/api/v1/slider/${slider1.id}`)
      .set('Authorization', accessTokenAdmin)
      .expect(404)
  });
});