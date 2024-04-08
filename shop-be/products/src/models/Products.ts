import * as dynamoose from 'dynamoose';
import * as serverlessConfiguration from '../../serverless';

export type TProduct = {
  id: string,
  title: string,
  description: string,
  price: number,
}

export type TAvailableProduct = TProduct & { count: number };

const schema = new dynamoose.Schema(
  {
    id: {
      type: String,
      hashKey: true,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  }
)



// @ts-ignore
export const ProductsModel = dynamoose.model<TProduct>(serverlessConfiguration.custom.tables.products, schema, {
  create: false,
  throughput: {
    read: 1,
    write: 1,
  },
})
