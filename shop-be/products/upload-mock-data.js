const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { fromIni } = require("@aws-sdk/credential-providers");
const {
  BatchWriteCommand,
  DynamoDBDocumentClient,
} = require("@aws-sdk/lib-dynamodb");

const products = require("./mocks/products.json");

const client = new DynamoDBClient({
  credentials: fromIni({
    profile: "awsTraining",
    filepath: "c:/Users/Andrei_Kandratsenka/.aws/credentials",
    clientConfig: { region: "eu-west-1" },
  }),
});
const docClient = DynamoDBDocumentClient.from(client);
function* chunkArray(arr, stride = 1) {
  for (let i = 0; i < arr.length; i += stride) {
    yield arr.slice(i, Math.min(i + stride, arr.length));
  }
}

const main = async () => {
  const productsChunks = chunkArray(
    products.map(({ count, ...rest }) => rest),
    25
  );
  const stockChunks = chunkArray(
    products.map(({ count, id: product_id }) => ({ product_id, count })),
    25
  );

  for (const chunk of productsChunks) {
    const putRequests = chunk.map((product) => ({
      PutRequest: {
        Item: product,
      },
    }));

    const command = new BatchWriteCommand({
      RequestItems: {
        products: putRequests,
      },
    });

    await docClient.send(command);
  }

  for (const chunk of stockChunks) {
    const putRequests = chunk.map((stock) => ({
      PutRequest: {
        Item: stock,
      },
    }));

    const command = new BatchWriteCommand({
      RequestItems: {
        stocks: putRequests,
      },
    });

    await docClient.send(command);
  }
};

main();
