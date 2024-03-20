import {formatJSONResponse, ValidatedEventAPIGatewayProxyEvent} from "@libs/api-gateway";

import { products } from "@mocks/data";

export const getProductById: ValidatedEventAPIGatewayProxyEvent = async (event) => {
  const { pathParameters: { id } } = event;
  const product = products.find(({id: productId}) => productId === id);

  if (!product) {
    return formatJSONResponse._404(`Product with id ${id} not found`);
  }

  return formatJSONResponse._200({ product })
};
