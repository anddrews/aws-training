import type { AWS } from "@serverless/typescript";

import getAvailableProducts from "@functions/get-available-products";
import getProductById from "@functions/get-product-by-id";
import createProduct from "@functions/create-product";
import createBatchProducts from "@functions/create-batch-products";

const serverlessConfiguration: AWS = {
  service: "product",
  frameworkVersion: "3",
  plugins: ["serverless-auto-swagger", "serverless-esbuild"],
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
    tables: {
      products: "products",
      stocks: "stocks",
    },
    autoswagger: {
      title: "Product service",
      apiType: "http",
      // @ts-ignore
      basePath: `/${("opt:stage", "dev")}`,
      excludeStages: ["production"],
      typefiles: ["./src/models/Products.ts"],
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
      SQS_FILE_IMPORT: { "Fn::ImportValue": "ImportProductQueueUrl" },
      SQS_ARN: { "Fn::ImportValue": "ImportProductQueueArn" },
      TABLE_PRODUCTS: "${self:custom.tables.products}",
      TABLE_STOCKS: "${self:custom.tables.stocks}",
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: [
          "dynamodb:DescribeTable",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
        ],
        Resource:
          "arn:aws:dynamodb:${self:provider.region}:*:table/${self:custom.tables.products}",
      },
      {
        Effect: "Allow",
        Action: [
          "dynamodb:DescribeTable",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
        ],
        Resource:
          "arn:aws:dynamodb:${self:provider.region}:*:table/${self:custom.tables.stocks}",
      },
    ],
  },
  resources: {
    Resources: {
      products: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "${self:custom.tables.products}",
          AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
          KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      },
      stocks: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "${self:custom.tables.stocks}",
          AttributeDefinitions: [
            { AttributeName: "product_id", AttributeType: "S" },
            { AttributeName: "count", AttributeType: "N" },
          ],
          KeySchema: [
            { AttributeName: "product_id", KeyType: "HASH" },
            { AttributeName: "count", KeyType: "RANGE" },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      },
    },
  },
  functions: {
    getAvailableProducts,
    getProductById,
    createProduct,
    createBatchProducts,
  },
  package: { individually: true },
};

module.exports = serverlessConfiguration;
