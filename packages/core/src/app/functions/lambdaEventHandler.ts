import { unmarshall } from "@aws-sdk/util-dynamodb";
import { getMongoDB } from "../../infra/dbs/mongodb";
import { DeserializedEvent } from "../../abstractions/event";
import { EventsIO } from "../../abstractions/events.io";
import * as MetricEvents from "../../domain/events/metric.events";
import { MetricEventHandler } from "../event/metric.eventHandler";
import { MongoError } from "mongodb";
let mongoDB: any;

const provideMongoDB = async () => {
  if (mongoDB) {
    return mongoDB;
  } else {
    mongoDB = await getMongoDB();
    return mongoDB;
  }
};

const extractDomainEventsFromStream = (streamEvent: any) => {
  return streamEvent.Records.map((record: any) => {
    return unmarshall(record.dynamodb.NewImage);
  });
};

const eventsIO = new EventsIO(Object.values(MetricEvents));

export const handler = async (streamEvent: any) => {
  const domainEvents = extractDomainEventsFromStream(streamEvent);
  const mongoDB = await provideMongoDB();
  const metricEventHandler = new MetricEventHandler(mongoDB);
  const deserializedEvents = domainEvents.map((event: any) => {
    return new DeserializedEvent(
      event.occurredOn,
      event.aggregateId,
      event.order,
      event.name,
      event.payload
    );
  });

  const instantiatedEvents = eventsIO.instantiateEvents(deserializedEvents);
  try {
    for (let event of instantiatedEvents) {
      const r = await metricEventHandler.handle(event);
      console.log(r);
    }
  } catch (err) {
    if (err instanceof MongoError && err.code === 11000) {
      console.log("Duplicate key error, most likely safe to ignore", err);
      return;
    } else {
      throw err;
    }
  }
};
