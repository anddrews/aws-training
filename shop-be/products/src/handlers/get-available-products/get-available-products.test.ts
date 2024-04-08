import { getAvailableProducts } from "./get-available-products";

describe('test lambda getAllProduct', () => {
  test('Should return correct list available items length', async () => {
    // @ts-ignore
    const { body } = await getAvailableProducts();
    const products  = JSON.parse(body);

    expect(products.length).toEqual(6);
  })
})
