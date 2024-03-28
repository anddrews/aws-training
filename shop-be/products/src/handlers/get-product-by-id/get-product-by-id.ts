import {formatJSONResponse, ValidatedEventAPIGatewayProxyEvent} from "@libs/api-gateway";

import { ProductsModel } from "@models/Products";

export const getProductById: ValidatedEventAPIGatewayProxyEvent = async (event) => {
  const { pathParameters: { id } } = event;
  console.log(`getProductById request with id: ${ id }`);

  try {
    const product = await ProductsModel.query('id').eq(id).exec();

    if (!product.length) {
      return formatJSONResponse._404(`Product with id ${ id } not found`);
    }

    return formatJSONResponse._200({ product })
  } catch (error) {
      console.error(error);

      return formatJSONResponse._500();
  }
};
