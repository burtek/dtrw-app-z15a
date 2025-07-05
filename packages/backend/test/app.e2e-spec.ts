import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import type { App } from 'supertest/types';

import { AppModule } from './../src/app.module';


describe('AppController (e2e)', () => {
    const expectedStatus = 200;

    let app: INestApplication<App>;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/ (GET)', () => request(app.getHttpServer())
        .get('/')
        .expect(expectedStatus)
        .expect('Hello World!'));
});
