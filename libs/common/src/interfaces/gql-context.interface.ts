import { IHttpRequest } from './http-request.interface';
import { IHttpResponse } from './http-response.interface';

/**
 * App Context Interface
 */
export interface IGqlContext {
  req: IHttpRequest;
  res: IHttpResponse;
}
