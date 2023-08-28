import * as MetricEvents from "../../domain/events/metric.events";
import { Db, ObjectId } from "mongodb";
import { EventHandler } from "../../abstractions/eventHandler";

const castStringIDToFilterID = (id: string) => {
  return id as unknown as ObjectId;
};

export class MetricEventHandler extends EventHandler {
  private db: Db;

  constructor(db: Db) {
    super();
    this.db = db;
    this.registerEventHandler(
      MetricEvents.MetricCreated.name,
      this.handleMetricCreated
    );
    this.registerEventHandler(
      MetricEvents.MetricDetailsUpdated.name,
      this.handleMetricDetailsUpdated
    );
    this.registerEventHandler(
      MetricEvents.MetricTargetUpdated.name,
      this.handleMetricTargetUpdated
    );
    this.registerEventHandler(
      MetricEvents.MetricDeadlineUpdated.name,
      this.handleMetricDeadlineUpdated
    );
    this.registerEventHandler(
      MetricEvents.MetricValueUpdated.name,
      this.handleMetricValueUpdated
    );
  }

  protected handleMetricCreated = (
    event: MetricEvents.MetricCreated
  ): Promise<any> => {
    return this.db.collection("Metrics").insertOne({
      _id: castStringIDToFilterID(event.aggregateId),
      version: event.order,
      name: event.props.name,
      description: event.props.description,
      target: event.props.target,
      deadline: event.props.deadline,
      unit: event.props.unit,
      values: [],
    });
  };

  protected handleMetricDetailsUpdated = (
    event: MetricEvents.MetricDetailsUpdated
  ): Promise<any> => {
    return this.db.collection("Metrics").updateOne(
      {
        _id: castStringIDToFilterID(event.aggregateId),
        version: event.order - 1,
      },
      {
        $set: {
          name: event.props.name,
          description: event.props.description,
          unit: event.props.unit,
          version: event.order,
        },
      }
    );
  };

  protected handleMetricTargetUpdated = (
    event: MetricEvents.MetricTargetUpdated
  ): Promise<any> => {
    return this.db.collection("Metrics").updateOne(
      {
        _id: castStringIDToFilterID(event.aggregateId),
        version: event.order - 1,
      },
      {
        $set: {
          target: event.props.target,
          version: event.order,
        },
      }
    );
  };

  protected handleMetricDeadlineUpdated = (
    event: MetricEvents.MetricDeadlineUpdated
  ): Promise<any> => {
    return this.db.collection("Metrics").updateOne(
      {
        _id: castStringIDToFilterID(event.aggregateId),
        version: event.order - 1,
      },
      {
        $set: {
          deadline: event.props.deadline,
          version: event.order,
        },
      }
    );
  };

  protected handleMetricValueUpdated = (
    event: MetricEvents.MetricValueUpdated
  ): Promise<any> => {
    return this.db.collection("Metrics").updateOne(
      {
        _id: castStringIDToFilterID(event.aggregateId),
        version: event.order - 1,
      },
      {
        $push: {
          values: { value: event.props.value, date: event.occurredOn },
        },
        $set: {
          version: event.order,
        },
      }
    );
  };

  backupStrategy(event: any): Promise<any> {
    //TODO fetch complete event stream, rehydrate entity and overwrite doc
    throw new Error("Method not implemented.");
  }
}
