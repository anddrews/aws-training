import { getAllProducts } from "./get-all-products";

describe('test lambda getAllProduct', () => {
  test('Should return correct list available items length', async () => {
    // @ts-ignore
    const { body } = await getAllProducts();
    const products  = JSON.parse(body);

    expect(products.length).toEqual(6);
  })
})
