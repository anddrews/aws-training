import { TProduct } from "@models/Products";

export type CartItem = {
  product: TProduct;
  count: number;
};
