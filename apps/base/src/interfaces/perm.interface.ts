import { IPolicySubject } from './subject.interface';

// Perm Interface
export interface IPerm<
  A extends string = string,
  S extends IPolicySubject = IPolicySubject
> {
  action: A;
  subject?: S;
}
