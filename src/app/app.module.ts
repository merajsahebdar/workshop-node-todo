import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { BullModule } from '@nestjs/bull';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { IsUniqueConstraint } from './validators';
import {
  appConfig,
  redisConfig,
  mailerConfig,
  typeormConfig,
  jwtConfig,
} from './configs';
import { UserBaseModule } from './modules';

/**
 * App Module
 */
@Module({
  imports: [
    // Third-party Modules
    // Configuration
    ConfigModule.forRoot({
      load: [appConfig, redisConfig, mailerConfig, typeormConfig, jwtConfig],
      isGlobal: true,
    }),
    // Queue
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('queue.host'),
          port: configService.get('queue.port'),
        },
      }),
    }),
    // Mailer
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: configService.get('mailer.transport'),
        defaults: {
          from: configService.get('mailer.defaults.from'),
        },
        template: {
          adapter: new PugAdapter(),
        },
      }),
    }),
    // Database
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('typeorm.host'),
        port: configService.get('typeorm.port'),
        username: configService.get('typeorm.username'),
        password: configService.get('typeorm.password'),
        database: configService.get('typeorm.database'),
        namingStrategy: new SnakeNamingStrategy(),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    // GraphQL
    GraphQLModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isDevelopment =
          configService.get('app.env', 'development') === 'development';

        return {
          playground: isDevelopment,
          path: '/',
          autoSchemaFile: true,
          tracing: isDevelopment,
          context: ({ req, res }) => ({ req, res }),
        };
      },
    }),
    // Application Modules
    // User Base
    UserBaseModule,
  ],
  providers: [IsUniqueConstraint],
})
export class AppModule {}
