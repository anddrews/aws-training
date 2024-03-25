import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S = unknown> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>


const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  };

export const formatJSONResponse = {
  _200 (response: Record<string, unknown> | Record<string, unknown>[]) {
    return {
      headers,
      statusCode: 200,
      body: JSON.stringify(response)
    }
  },
  _404 (message: string) {
    return {
      headers,
      statusCode: 404,
      body: JSON.stringify({error: message})
    }
  }
}
