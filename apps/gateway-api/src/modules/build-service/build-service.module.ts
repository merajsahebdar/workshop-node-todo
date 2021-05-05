import { Module } from '@nestjs/common';
import { GATEWAY_BUILD_SERVICE } from '@nestjs/graphql';
import { HeadersDataSource } from './data-sources';

/**
 * Build Service Module
 */
@Module({
  providers: [
    {
      provide: HeadersDataSource,
      useValue: HeadersDataSource,
    },
    {
      provide: GATEWAY_BUILD_SERVICE,
      useFactory: (HeadersDataSource) => {
        return ({ url }) => new HeadersDataSource({ url });
      },
      inject: [HeadersDataSource],
    },
  ],
  exports: [GATEWAY_BUILD_SERVICE],
})
export class BuildServiceModule {}
