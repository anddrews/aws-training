import * as dynamoose from 'dynamoose';

import * as serverlessConfiguration from '../../serverless';

export type TStock = {
  product_id: string,
  count: number
}


const schema = new dynamoose.Schema(
  {
    product_id: {
      type: String,
      hashKey: true,
      required: true,
    },
    count: {
      type: Number,
      rangeKey: true,
      required: true,
    }
  }
)

// @ts-ignore
export const StocksModel = dynamoose.model<TStock>(serverlessConfiguration.custom.tables.stocks, schema, {
  create: false,
  throughput: {
    read: 1,
    write: 1,
  },
})
