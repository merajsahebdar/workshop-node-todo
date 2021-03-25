import { IPolicyBuilderSubject } from './subject.interface';

// Rule Interface
export interface IRule<
  A extends string = string,
  S extends IPolicyBuilderSubject = IPolicyBuilderSubject
> {
  action: A;
  subject?: S;
}
