import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { appConfig } from './configs/app.config';
import { jwtConfig } from './configs/jwt.config';
import { typeormConfig } from './configs/typeorm.config';
import { UserBaseModule } from './modules/user-base';

/**
 * App Module
 */
@Module({
  imports: [
    // Third-party Modules
    // Configuration
    ConfigModule.forRoot({
      load: [appConfig, typeormConfig, jwtConfig],
      isGlobal: true,
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
        };
      },
    }),
    // Application Modules
    // User Base
    UserBaseModule,
  ],
})
export class AppModule {}
