import type { AWS } from '@serverless/typescript';

import getAllProducts from '@functions/get-all-products';
import getProductById from '@functions/get-product-by-id';

const serverlessConfiguration: AWS = {
  service: 'product',
  frameworkVersion: '3',
  plugins: ['serverless-auto-swagger', 'serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    region: 'eu-west-1',
    profile: 'awsTraining',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  // import the function via paths
  functions: { getAllProducts, getProductById },
  package: { individually: true },
  custom: {
    // @ts-ignore
    stage: `${'opt:stage', 'dev'}` ,
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node18',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    autoswagger: {
      title: 'Product service',
      apiType: 'http',
      // @ts-ignore
      basePath: `/${'opt:stage', 'dev'}`,
      excludeStages: ['production'],
      typefiles: [
        './src/models/Product.ts'
      ]
    }
  },
};

module.exports = serverlessConfiguration;
