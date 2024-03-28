import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";

import { ProductsModel } from "@models/Products";
import { StocksModel } from "@models/Stocks";

export const getAvailableProducts: ValidatedEventAPIGatewayProxyEvent = async () => {
  try {
    const availableProductsInStock = await StocksModel
      .scan('count')
      .gt(0)
      .exec();
    const normalizedAvailableInStock = availableProductsInStock.reduce((acc, v) => {
      acc[v.product_id] = v.count;
      acc.ids.push(v.product_id);

      return acc;
    }, { ids: [] })
    const products = await ProductsModel
      .scan('id')
      .in(normalizedAvailableInStock.ids)
      .exec();

    return formatJSONResponse._200(products.map(v => ({ ...v, count: normalizedAvailableInStock[v.id] })));
  } catch (e) {
    console.error('getAvailableProducts request', e);

    return formatJSONResponse._500();
  }

};
