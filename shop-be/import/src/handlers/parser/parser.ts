const csv = require("csv-parser");
const { finished } = require("node:stream/promises");

import {
  S3Client,
  GetObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import * as serverlessConfiguration from "../../../serverless";
export const parser = async (event) => {
  // @ts-ignore
  const Bucket = serverlessConfiguration.custom.bucketName;
  const s3Client = new S3Client({
    // @ts-ignore
    region: serverlessConfiguration.provider.region,
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
      await finished(
        response.Body.pipe(csv()).on("data", (data) =>
          console.log("Data: ", data)
        )
      );
      await s3Client.send(copyObject);
      await s3Client.send(deleteObject);
    } catch (e) {
      console.error(e);
    }
  }
};
