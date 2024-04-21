import type { AWS } from "@serverless/typescript";

import importFile from "@functions/import";
import parser from "@functions/parser";

const serverlessConfiguration: AWS = {
  service: "import",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
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
    bucketName: "import-service-storage",
    autoswagger: {
      title: "Import service",
      apiType: "http",
      // @ts-ignore
      basePath: `/${("opt:stage", "dev")}`,
      excludeStages: ["production"],
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
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["s3:*"],
        Resource: "arn:aws:s3:::${self:custom.bucketName}/*",
      },
      {
        Effect: "Allow",
        Action: ["s3:ListBucket"],
        Resource: "arn:aws:s3:::${self:custom.bucketName}",
      },
    ],
  },
  resources: {
    Resources: {
      WebAppS3Bucket: {
        Type: "AWS::S3::Bucket",
        Properties: {
          BucketName: "${self:custom.bucketName}",
          AccessControl: "Private",
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedMethods: ["PUT"],
                AllowedOrigins: ["*"],
              },
            ],
          },
        },
      },
    },
  },
  functions: { importFile, parser },
  package: { individually: true },
};

module.exports = serverlessConfiguration;
