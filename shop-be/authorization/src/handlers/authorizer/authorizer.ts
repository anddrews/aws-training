import { PolicyDocument } from "aws-lambda";

type TAuthorizerResponse = {
  principalId: string;
  policyDocument: PolicyDocument;
};

type TAuthorizerParams = {
  type: string;
  methodArn: string;
  authorizationToken: string;
};

export const authorizer: (
  event: TAuthorizerParams,
) => Promise<TAuthorizerResponse> = async (event) => {
  console.log(event);

  const authUser = process.env.USER_NAME;
  const authPass = process.env.PASSWORD;
  const token = event?.authorizationToken.split(" ")[1];
  const authString = Buffer.from(authUser + ":" + authPass).toString("base64");
  const isAuthorized = token === authString;

  return getPolicy(token, isAuthorized, event.methodArn);
};

const getPolicy = (
  principalId: string,
  isAuthorized = false,
  resource: string,
): TAuthorizerResponse => ({
  principalId,
  policyDocument: {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: isAuthorized ? "Allow" : "Deny",
        Resource: [resource],
      },
    ],
  },
});
