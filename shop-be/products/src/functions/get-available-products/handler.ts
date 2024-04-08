import { middyfy } from '@libs/lambda';
import { getAvailableProducts } from "@handlers/get-available-products/get-available-products";

export const main = middyfy(getAvailableProducts);
