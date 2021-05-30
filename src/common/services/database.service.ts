import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

/**
 * Database Service
 */
export class DatabaseService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  /**
   * Constructor
   */
  constructor() {
    super();

    this.$use(this.softDeleteMiddleware);
  }

  /**
   * Soft Delete Middleware
   *
   * @param params
   * @param next
   * @returns
   */
  private async softDeleteMiddleware(
    params: Prisma.MiddlewareParams,
    next: (params: Prisma.MiddlewareParams) => Promise<any>,
  ): Promise<any> {
    if (params.action === 'delete') {
      params.action = 'update';
      params.args['data'] = {
        deletedAt: new Date().toISOString(),
      };
    }

    if (params.action === 'deleteMany') {
      params.action = 'updateMany';

      if (params.args.data != undefined) {
        params.args.data['deletedAt'] = new Date().toISOString();
      } else {
        params.args['data'] = {
          deletedAt: new Date().toISOString(),
        };
      }
    }

    return next(params);
  }

  /**
   * On Module Init
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * On Module Destroy
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
