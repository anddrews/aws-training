import { v4 } from 'uuid';
import { CustomError } from 'dynamoose-utils';
import { transaction } from 'dynamoose';

import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import {ProductsModel, TAvailableProduct} from "@models/Products";
import {StocksModel} from "@models/Stocks";

export const createProduct: ValidatedEventAPIGatewayProxyEvent<TAvailableProduct> = async (event) => {
  console.log(`Create product request. body: ${event.body}`);

  try {
    const { title, description, price, count  } = event.body;
    const id = v4();
    const result = await transaction([
      ProductsModel.transaction.create({
        id,
        title,
        description,
        price
      }),
      StocksModel.transaction.create({
        product_id: id,
        count
      })
    ]);

    return formatJSONResponse._200(result);
  } catch (error) {
    console.error(`Create product request error: ${error}`);

    if (error instanceof CustomError.ValidationError) {
      return formatJSONResponse._400(error.message);
    }

    return formatJSONResponse._500();
  }

};
