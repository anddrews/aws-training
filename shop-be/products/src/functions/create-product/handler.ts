import { middyfy } from '@libs/lambda';
import { createProduct } from "@handlers/create-product/create-product";

export const main = middyfy(createProduct);
