import { ProductsModel, TProduct } from "@models/Products";
import { StocksModel, TStock } from "@models/Stocks";
import { transaction } from "dynamoose";
import { SQSEvent } from "aws-lambda";
import { v4 } from "uuid";

export const createBatchProducts = async (event: SQSEvent) => {
  console.log(
    `Create products queue event records: ${JSON.stringify(event.Records)}`,
  );

  try {
    const { products, stocks } = event.Records.reduce(
      (acc, { body }) => {
        const { title, description, price, count } = JSON.parse(body);
        const id = v4();

        acc.products.push({
          id,
          title,
          description,
          price: Number(price),
        });

        acc.stocks.push({
          product_id: id,
          count: Number(count),
        });

        return acc;
      },
      {
        products: [],
        stocks: [],
      } as { products: TProduct[]; stocks: TStock[] },
    );

    for (let i = 0; i < event.Records.length; i++) {
      await transaction([
        ProductsModel.transaction.create(products[i]),
        StocksModel.transaction.create(stocks[i]),
      ]);
    }
  } catch (error) {
    console.error(`Create products queue event records error: ${error}`);
  }
};
