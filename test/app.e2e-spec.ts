import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/login should return a JWT for valid credentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'haris@example.com',
        password: 'password123',
      })
      .expect(201);

    expect(response.body).toHaveProperty('access_token');
    expect(typeof response.body.access_token).toBe('string');
  });

  it('POST /auth/login should return 401 for wrong password', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'haris@example.com',
        password: 'wrong-password',
      })
      .expect(401);
  });

  it('POST /tasks should return 401 without JWT', async () => {
    await request(app.getHttpServer())
      .post('/tasks')
      .send({
        title: 'Unauthorized Task',
        description: 'This should fail',
        status: 'todo',
        priority: 3,
        projectId: 1,
      })
      .expect(401);
  });

  it('POST /tasks should create a task with a valid JWT', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'haris@example.com',
        password: 'password123',
      })
      .expect(201);

    accessToken = loginResponse.body.access_token;

    const response = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'E2E Authenticated Task',
        description: 'Created using JWT authentication',
        status: 'todo',
        priority: 3,
        projectId: 1,
        assigneeId: 1,
        tagIds: [2, 4],
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('E2E Authenticated Task');
  });

  it('PATCH /tasks/:id should return 401 without JWT', async () => {
    await request(app.getHttpServer())
      .patch('/tasks/17')
      .send({
        title: 'Unauthorized Update',
      })
      .expect(401);
  });

  it('DELETE /tasks/:id should return 401 without JWT', async () => {
    await request(app.getHttpServer()).delete('/tasks/17').expect(401);
  });
});
