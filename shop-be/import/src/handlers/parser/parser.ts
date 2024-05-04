const csv = require("csv-parser");
const { finished } = require("node:stream/promises");

import {
  S3Client,
  GetObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const sqsClient = new SQSClient({
  region: process.env.REGION,
});

const snsClient = new SNSClient({
  region: process.env.REGION,
});

export const parser = async (event) => {
  const Bucket = process.env.BUCKET_NAME;
  const s3Client = new S3Client({
    region: process.env.REGION,
  });

  const sqsCommand = (message) =>
    new SendMessageCommand({
      QueueUrl: process.env.SQS_FILE_IMPORT,
      MessageBody: JSON.stringify(message),
      DelaySeconds: 3,
    });

  for (const record of event.Records) {
    try {
      const {
        s3: {
          object: { key: Key },
        },
      } = record;
      const getObject = new GetObjectCommand({
        Bucket,
        Key,
      });
      const copyObject = new CopyObjectCommand({
        Bucket,
        Key: Key.replace("upload", "processed"),
        CopySource: `${Bucket}/${Key}`,
      });
      const deleteObject = new DeleteObjectCommand({
        Bucket,
        Key,
      });

      const response = await s3Client.send(getObject);
      let products = [];
      await finished(
        response.Body.pipe(csv()).on("data", (data) => {
          sqsClient.send(sqsCommand(data));

          products = [...products, data];

          console.log("Sent msg to queue ", data);
        }),
      );
      await s3Client.send(copyObject);
      await s3Client.send(deleteObject);

      console.log("products:", products);

      if (products.length < 5) {
        const notifyCommand = new PublishCommand({
          Subject: "New file was imported",
          Message: JSON.stringify(products),
          TopicArn: process.env.TOPIC_ARN,
          MessageAttributes: {
            ProductsLength: { StringValue: "ShortList", DataType: "String" },
          },
        });
        await snsClient.send(notifyCommand);
      } else {
        const notifyCommand = new PublishCommand({
          Subject: "New file was imported",
          Message: JSON.stringify(products),
          TopicArn: process.env.TOPIC_ARN,
          MessageAttributes: {
            ProductsLength: { StringValue: "LongList", DataType: "String" },
          },
        });
        await snsClient.send(notifyCommand);
      }
    } catch (e) {
      console.error(e);
    }
  }
};
