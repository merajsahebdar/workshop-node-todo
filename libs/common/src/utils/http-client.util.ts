import fetch, { RequestInfo, RequestInit, Headers } from 'node-fetch';

/**
 * Http Client Error
 */
export class HttpClientError extends Error {}

/**
 * Http Client
 */
export async function httpClient(info: RequestInfo, init: RequestInit) {
  init.headers = init.headers ?? new Headers();

  init.headers['Content-Type'] = 'application/json';

  const res = await fetch(info, init);
  if (res.status >= 200 && res.status <= 299) {
    return await res.json();
  }

  throw new HttpClientError(
    `Server returned response with status: ${res.status}`,
  );
}
