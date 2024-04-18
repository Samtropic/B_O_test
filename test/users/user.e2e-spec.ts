import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import * as request from 'supertest';
import { BoatsModule } from '../../src/boats/boats.module';
import { CreateUserDto } from '../../src/users/dto/create-user.dto';
import { UpdateUserDto } from '../../src/users/dto/update-user.dto';
import { UsersModule } from '../../src/users/users.module';

describe('[Feature] users - /users', () => {
  let app: NestFastifyApplication;

  const user = {
    firstname: '  Jean  ',
    lastname: ' Reno  ',
    email: 'jean.reno@visiteurs.com',
    password: 'waszdefrKSJSKqqf12456**!!qdqd',
  };

  const userWithBoat = {
    firstname: '  Barbe  ',
    lastname: ' Noire  ',
    email: 'barbenoire@pirate.com',
    password: 'mmqojfjqzwaszdefrKSJSKqqf12456**!!qdqd',
    boats: [
      {
        name: 'Flying Dutchman',
        length: 50,
        width: 5,
        engines: [
          {
            power: 10,
            model: 'flavios-5',
            maker: 'gruppman',
          },
        ],
      },
    ],
  };

  let moduleFixture: TestingModule;
  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        UsersModule,
        BoatsModule,
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: `${path.join(__dirname, '..', '..', '.env')}`,
        }),
        TypeOrmModule.forRootAsync({
          useFactory: () => ({
            type: 'postgres',
            host: process.env.TESTDB_HOST || 'testdb-boaton',
            port: +process.env.TESTDB_PORT || 5432,
            username: process.env.POSTGRES_USER || 'root',
            password: process.env.POSTGRES_PASSWORD || 'pass',
            database: process.env.POSTGRES_DB || 'postgres',
            retryAttempts: 30,
            autoLoadEntities: true,
            synchronize: true, // TODO: disable in production
            dropSchema: true, // ATTENTION: Make sure you're set on TEST DB
          }),
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  }, 300000);

  it('Create [POST /]', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send(user as CreateUserDto)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        expect(body.firstname).toMatch('jean');
        expect(body.lastname).toMatch('reno');
        expect(body.email).toMatch('jean.reno@visiteurs.com');
        expect(body.password).toBeUndefined();
      });
  });

  it('Get all [GET /]', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        const [{ ...user }] = body;
        expect(user.firstname).toMatch('jean');
        expect(user.lastname).toMatch('reno');
        expect(user.email).toMatch('jean.reno@visiteurs.com');
        expect(user.password).toBeUndefined();
      });
  });

  it('Get one [GET /:id]', () => {
    return request(app.getHttpServer())
      .get('/users/1')
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.firstname).toMatch('jean');
        expect(body.lastname).toMatch('reno');
        expect(body.email).toMatch('jean.reno@visiteurs.com');
        expect(body.password).toBeUndefined();
      });
  });

  it('Update one [PATCH /:id]', () => {
    const updateduser: UpdateUserDto = {
      firstname: 'UpdatedName',
    };
    return request(app.getHttpServer())
      .patch('/users/1')
      .send(updateduser)
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.firstname).toEqual<string>(
          updateduser.firstname.toLocaleLowerCase(),
        );
      });
  });

  it('Create user with boat [POST /]', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send(userWithBoat as CreateUserDto)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        expect(body.firstname).toMatch('barbe');
        expect(body.lastname).toMatch('noire');
        expect(body.email).toMatch('barbenoire@pirate.com');
        expect(body.password).toBeUndefined();
      });
  });

  it('Get boats [GET /:id/boats]', () => {
    return request(app.getHttpServer())
      .get('/users/2/boats')
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        const [{ ...boat }] = body;
        expect(boat.name).toMatch('Flying Dutchman');
        expect(boat.length).toBe(50);
        expect(boat.width).toBe(5);
        expect(boat.engines[0]).toMatchObject(userWithBoat.boats[0].engines[0]);
      });
  });

  it('Delete one [DEL /:id]', () => {
    return request(app.getHttpServer())
      .del('/users/1')
      .expect(HttpStatus.OK)
      .then(() => {
        return request(app.getHttpServer())
          .get('/users/1')
          .expect(HttpStatus.NOT_FOUND);
      });
  });

  afterAll(async () => {
    await moduleFixture.close();
    await app.close();
  });
});
