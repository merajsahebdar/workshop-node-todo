import { ExecutionContext } from '@nestjs/common';
import { IPolicyBuilderSubject } from './subject.interface';

// Policy Builder Options
export type IPolicyBuilderOptions<
  A extends string = string,
  S extends IPolicyBuilderSubject = IPolicyBuilderSubject
> = {
  can: (action: A, subject?: S) => void;
  context: ExecutionContext;
};

/**
 * Policy Builder Interface
 */
export interface IPolicyBuilder<
  A extends string = string,
  S extends IPolicyBuilderSubject = IPolicyBuilderSubject
> {
  /**
   * Builder
   *
   * @param {IPolicyBuilderOptions} options
   */
  build(options: IPolicyBuilderOptions<A, S>): void;
}
