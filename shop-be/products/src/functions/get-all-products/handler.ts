import { middyfy } from '@libs/lambda';
import {getAllProducts} from "@handlers/get-all-products/get-all-products";

export const main = middyfy(getAllProducts);
