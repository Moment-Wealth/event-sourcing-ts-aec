import * as cdk from "aws-cdk-lib";
import {
  aws_dynamodb,
  aws_lambda,
  aws_lambda_event_sources,
} from "aws-cdk-lib";

export class EventSourcingStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new aws_dynamodb.Table(this, "EventStore", {
      billingMode: aws_dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "aggregateId",
        type: aws_dynamodb.AttributeType.STRING,
      },
      sortKey: { name: "order", type: aws_dynamodb.AttributeType.NUMBER },
      stream: aws_dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
    });

    const func = new aws_lambda.Function(this, "EventProcessor", {
      runtime: aws_lambda.Runtime.NODEJS_18_X,
      handler: "dist/src/app/functions/lambdaEventHandler.handler",
      code: aws_lambda.Code.fromAsset("../packages/core/dist/lambda.zip"),
    });

    table.grantStreamRead(func);

    func.addEventSource(
      new aws_lambda_event_sources.DynamoEventSource(table, {
        startingPosition: aws_lambda.StartingPosition.LATEST,
        filters: [
          aws_lambda.FilterCriteria.filter({
            eventName: aws_lambda.FilterRule.isEqual("INSERT"),
          }),
        ],
      })
    );
  }
}
