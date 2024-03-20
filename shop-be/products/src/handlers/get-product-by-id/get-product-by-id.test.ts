import { getProductById } from "./get-product-by-id";

describe('test lambda getProductById', () => {
  test('Should return object by id', async () => {
    const event = { pathParameters: { id: '7567ec4b-b10c-48c5-9345-fc73c48a80aa' } }
    // @ts-ignore
    const { body } = await getProductById(event);
    const { product } = JSON.parse(body);

    expect(product).toEqual(  {
      description: "Short Product Description1",
      id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
      price: 24,
      title: "ProductOne",
    });
  })
  test('Should return error for wrong product id', async () => {
    const event = { pathParameters: { id: 'test' } }
    // @ts-ignore
    const { body, statusCode } = await getProductById(event);
    const { error } = JSON.parse(body);

    expect(error).toEqual('Product with id test not found');
    expect(statusCode).toEqual(404);
  })
})
