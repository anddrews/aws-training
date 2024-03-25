import { middyfy } from '@libs/lambda';
import {getProductById} from "@handlers/get-product-by-id/get-product-by-id";
export const main = middyfy(getProductById);
