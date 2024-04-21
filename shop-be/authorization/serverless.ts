import type { AWS } from "@serverless/typescript";

import authorizer from "@functions/authorizer";

const serverlessConfiguration: AWS = {
  service: "authorization",
  frameworkVersion: "3",
  plugins: ["serverless-dotenv-plugin", "serverless-esbuild"],
  custom: {
    // @ts-ignore
    stage: `${("opt:stage", "dev")}`,
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node18",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
  provider: {
    name: "aws",
    runtime: "nodejs18.x",
    region: "eu-west-1",
    profile: "awsTraining",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      USER_NAME: "${env.USER_NAME}",
      PASSWORD: "${env.PASSWORD}",
    },
  },
  resources: {
    Outputs: {
      BasicAuthorizerArn: {
        Value:
          "arn:aws:lambda:${aws:region}:${aws:accountId}:function:${self:service}-${self:custom.stage}-authorizer",
        Export: {
          Name: "BasicAuthorizerArn",
        },
      },
    },
  },
  functions: { authorizer },
  package: { individually: true },
};

module.exports = serverlessConfiguration;
