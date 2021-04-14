import { DeepPartial, FindConditions, EntityTarget } from 'typeorm';

export type IPolicyBuilderSubject<T = any> = [
  'typeorm',
  EntityTarget<T>,
  DeepPartial<T>,
];

export type IPolicySubject<T = any> = [
  'typeorm',
  EntityTarget<T>,
  FindConditions<T>,
];
