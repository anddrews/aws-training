import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: "${self:custom.bucketName}",
        event: "s3:ObjectCreated:*",
        rules: [{ prefix: "upload/" }],
        existing: true,
      },
    },
  ],
};
