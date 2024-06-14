import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as path from 'path';
import { AppModule } from 'src/app.module';
import { DataSource } from 'typeorm';
import * as request from 'supertest';

let db: DataSource;
let app: INestApplication;


export const getDb = async () => {
  const srcDir = path.join(__dirname, '../src');
  if (!db) {
    db = new DataSource({
      type: "postgres",
      host: "postgres-test",
      port: 5432,
      username: "postgres",
      password: "postgres",
      database: "khablog_db",
      synchronize: true,
      entities: [srcDir + '/**/*.entity{.ts,.js}'],
    });
  }
  return await db.initialize();
};

export const getRepo = async (entity) => {
  const db = await getDb();
  return await db.getRepository(entity);
};

export const initApp = async () => {
  if (!app) {
    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
    });

    afterAll(async () => {
      await Promise.all([app.close()]);
    });
    return app;
  }
  return app;
};

export const dropDb = async () => {
  // const repo = await getRepo(entity);
  // const tableName = repo.metadata.tableName;
  // await repo.query(`TRUNCATE TABLE "${tableName}" CASCADE`);
  db = await getDb();
  const tables = await db.query(
    `SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname='public'`
  );

  for (const table of tables) {
    await db.query(`TRUNCATE TABLE "${table.tablename}" CASCADE`);
  }
  await db.destroy();
};

export const seedUser = async (httpClient: request.SuperTest<request.Test>) => {
  const user1Promise = httpClient.post('/api/v1/auth/register').send({
    email: 'trikhanhtk0038+test1@gmail.com',
    password: 'Khanh@123',
    first_name: 'tk',
    last_name: 'abc',
  });

  const user2Promise = httpClient.post('/api/v1/auth/register').send({
    email: 'trikhanhtk0038+test2@gmail.com',
    password: 'Khanh@123',
    first_name: 'tk1',
    last_name: 'abc1',
  });

  return await Promise.all([user1Promise, user2Promise]);
};

export const updateUserRole = async (role: string, userId: number) => {
  try {
    const db = await getDb();
    await db.query("UPDATE users SET role = $1 WHERE id = $2", [role, userId]);
    await db.destroy();
    console.log("User role updated successfully.");
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};

export const seedLogin = async (httpClient: request.SuperTest<request.Test>, email: string) => {
  let accessToken: string, refreshToken: string;
  await httpClient
    .post('/api/v1/auth/login')
    .send({ email, password: 'Khanh@123' })
    .expect(201)
    .expect((res) => {
      accessToken = `Bearer ${res.body.data.accessToken}`;
      refreshToken = `Bearer ${res.body.data.refreshToken}`;
    });

  return {
    accessToken,
    refreshToken,
  };
};


export const seedLoginAdmin = async (httpClient: request.SuperTest<request.Test>) => {
  let accessToken: string, refreshToken: string;
  const admin = await httpClient
    .post('/api/v1/auth/register')
    .send({
      email: 'trikhanhtk0038+test4@gmail.com',
      password: 'Khanh@123',
      first_name: 'tk2',
      last_name: 'abc2',
    });

  await updateUserRole('ADMIN', admin.body.data.id);

  const response = await httpClient
    .post('/api/v1/auth/login')
    .send({ email: 'trikhanhtk0038+test4@gmail.com', password: 'Khanh@123' })
    .expect(201);

  accessToken = `Bearer ${response.body.data.accessToken}`;
  refreshToken = `Bearer ${response.body.data.refreshToken}`;

  return {
    accessToken,
    refreshToken,
  };

};

export const seedTag = async (httpClient: request.SuperTest<request.Test>, token) => {
  const tag1 = httpClient.post('/api/v1/tags')
    .set('Authorization', token)
    .send({
      tagName: 'Tag 1',
      description: 'description 1',
      tagType: 1,
    });

  const tag2 = httpClient.post('/api/v1/tags')
    .set('Authorization', token)
    .send({
      tagName: 'Tag 2',
      description: 'description 2',
      tagType: 1,
    });

  return await Promise.all([tag1, tag2]);
}


export const seedArticles = async (httpClient: request.SuperTest<request.Test>, token: string, tags: string[]) => {
  const article1 = httpClient
    .post('/api/v1/articles')
    .set('Authorization', token)
    .set('Content-Type', 'multipart/form-data')
    .field('title', 'title 1')
    .field('description', 'Description 1')
    .field('keyword', 'keyword 1')
    .field('body', 'Main content 1')
    .field('tag', tags.join(','))
    .expect(201);

  const article2 = httpClient

    .post('/api/v1/articles')
    .set('Authorization', token)
    .set('Content-Type', 'multipart/form-data')
    .field('title', 'title 2')
    .field('description', 'Description 2')
    .field('keyword', 'keyword 2')
    .field('body', 'Main content 2')
    .field('tag', tags.join(","))
    .expect(201);

  return await Promise.all([article1, article2]);
}

export const seedSeries = async (httpClient: request.SuperTest<request.Test>, token: string) => {
  const series1 = httpClient
    .post('/api/v1/series')
    .set('Authorization', token)
    .send({
      title: "Series 1",
      description: "Series 1 description"
    });

  const series2 = httpClient
    .post('/api/v1/series')
    .set('Authorization', token)
    .send({
      title: "Series 2",
      description: "Series 2 description"
    })

  return await Promise.all([series1, series2]);
}

export const seedSlider = async (httpClient: request.SuperTest<request.Test>, token: string) => {
  const slider1 = httpClient
    .post('/api/v1/slider')
    .set('Authorization', token)
    .set('Content-Type', 'multipart/form-data')
    .field('name', 'slider 1')
    .field('description', 'Description 1')
    .field('link', 'http://view.demo.com')
    .field('status', 'on')
    .attach("slideImage", path.resolve(__dirname, './test.jpg'))
    .expect(201);

  const slider2 = httpClient
    .post('/api/v1/slider')
    .set('Authorization', token)
    .set('Content-Type', 'multipart/form-data')
    .field('name', 'slider 2')
    .field('description', 'Description 2')
    .field('link', 'http://view.demo.com')
    .field('status', 'on')
    .attach("slideImage", path.resolve(__dirname, './test.jpg'))
    .expect(201);

  return await Promise.all([slider1, slider2]);
}
