import { middyfy } from "@libs/lambda";
import { importFile } from "@handlers/import-file/import-file";
export const main = middyfy(importFile);
