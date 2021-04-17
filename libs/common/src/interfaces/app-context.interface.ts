import { IAppRequest } from './app-request.interface';
import { IAppResponse } from './app-response.interface';

/**
 * App Context Interface
 */
export interface IAppContext {
  req: IAppRequest;
  res: IAppResponse;
}
