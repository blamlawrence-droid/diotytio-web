import serverless from 'serverless-http';
import type { Config } from '@netlify/functions';
import { createApp } from '../../server/index.js';

function getHandler() {
  return getHandler.cached ??= serverless(createApp().app);
}

export default async (request: Request, context: { ip?: string }) => {
  const url = new URL(request.url);
  const body = ['GET', 'HEAD'].includes(request.method) ? undefined : await request.text();
  const result = await getHandler()({
    httpMethod: request.method,
    path: url.pathname,
    rawUrl: request.url,
    headers: Object.fromEntries(request.headers),
    queryStringParameters: Object.fromEntries(url.searchParams),
    body,
    isBase64Encoded: false,
    requestContext: { identity: { sourceIp: context.ip || '127.0.0.1' } },
  }, {});
  const headers = new Headers(result.headers);
  for (const [key, values] of Object.entries(result.multiValueHeaders || {})) {
    for (const value of values as string[]) headers.append(key, value);
  }
  return new Response(result.isBase64Encoded ? Buffer.from(result.body, 'base64') : result.body, {
    status: result.statusCode,
    headers,
  });
};

export const config: Config = { path: '/api/*' };
