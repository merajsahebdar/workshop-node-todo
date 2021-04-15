import { IPolicySubject } from './subject.interface';

// Policy Handler Options
type PolicyHandlerOptions<
  A extends string = string,
  S extends IPolicySubject = IPolicySubject
> = {
  can: (action: A, subject?: S) => void;
  args: Record<string, any>;
};

/**
 * Policy Handler Interface
 */
export type IPolicyHandler<
  A extends string = string,
  C extends IPolicySubject = IPolicySubject
> = (options: PolicyHandlerOptions<A, C>) => void;
