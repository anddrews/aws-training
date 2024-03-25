import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: '/product/available',
        cors: true,
        responses: {
          200: {
            bodyType: 'Product'
          }
        }
      },
    },
  ],
};
