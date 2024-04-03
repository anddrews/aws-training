import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        // @ts-ignore @TODO fix hardcoded bucket name
        bucket: "import-service-storage",
        event: "s3:ObjectCreated:*",
        rules: [{ prefix: "upload/" }],
        existing: true,
      },
    },
  ],
};
