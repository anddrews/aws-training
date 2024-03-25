import {formatJSONResponse, ValidatedEventAPIGatewayProxyEvent} from "@libs/api-gateway";

import { products } from "@mocks/data";

export const getAllProducts: ValidatedEventAPIGatewayProxyEvent = async () => {
  return formatJSONResponse._200(products);
};
