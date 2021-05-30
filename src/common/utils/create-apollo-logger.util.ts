import { Logger } from '@nestjs/common';

/**
 * Apollo Logger
 */
export class ApolloLogger extends Logger {
  /**
   * Info
   *
   * @param {string} message
   */
  info(message: string) {
    this.log(message);
  }
}

/**
 * Create Apollo Logger
 *
 * @param {string} context
 */
export function createApolloLogger(context: string): ApolloLogger {
  return new ApolloLogger(context);
}
