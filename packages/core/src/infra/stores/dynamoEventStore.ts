import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { IEventStore } from "../../abstractions/eventStore.interface";
import { Event, DeserializedEvent } from "../../abstractions/event";
import { ConcurrencyError, WrongIdentifierError } from "../errors/infra.errors";

export class DynamoEventStore implements IEventStore {
  private readonly tableName: string;
  private readonly documentClient: DocumentClient;

  constructor(tableName: string) {
    this.tableName = tableName;
    this.documentClient = new DocumentClient();
  }

  async appendEvents(aggregateId: string, events: Event[]): Promise<void> {
    const transactionInput = events.map((event) => {
      const conditionExpression =
        "attribute_not_exists(aggregateId) OR #order < :order";
      const expressionAttributeValues = {
        ":order": event.order, //TODO proper serialization
      };
      const expressionAttributeNames = {
        "#order": "order",
      };

      return {
        Put: {
          Item: {
            aggregateId,
            order: event.order, //TODO proper serialization
            name: event.name,
            occurredOn: event.occurredOn,
            payload: event.props,
          },
          TableName: this.tableName,
          ConditionExpression: conditionExpression,
          ExpressionAttributeValues: expressionAttributeValues,
          ExpressionAttributeNames: expressionAttributeNames,
        },
      };
    });

    try {
      const response = await this.documentClient
        .transactWrite({
          TransactItems: transactionInput,
        })
        .promise();
    } catch (err: any) {
      throw new ConcurrencyError(
        `Transaction Error: appending events: ${err.message}`
      );
    }
  }

  async getEventStream(aggregateId: string, version: number): Promise<Event[]> {
    const queryParams = {
      TableName: this.tableName,
      KeyConditionExpression: "aggregateId = :aggregateId",
      ExpressionAttributeValues: {
        ":aggregateId": aggregateId,
      },
    };

    const queryResult = await this.documentClient.query(queryParams).promise();

    if (!queryResult.Items || queryResult.Items?.length === 0) {
      throw new WrongIdentifierError(`Wrond identifier: ${aggregateId}`);
    }
    const events = queryResult.Items.map((item) => {
      return new DeserializedEvent(
        item.occurredOn,
        item.aggregateId,
        item.order,
        item.name,
        item.payload
      );
    });

    if (events[events.length - 1].order > version) {
      throw new ConcurrencyError(
        `Outdaded version: aggregate ${aggregateId} version ${version} outdated`
      );
    }
    if (events[events.length - 1].order < version) {
      throw new WrongIdentifierError(
        `Wrong version: version ${version} is a mismatch for aggregate ${aggregateId} `
      );
    }

    return events;
  }
}

export default DynamoEventStore;
