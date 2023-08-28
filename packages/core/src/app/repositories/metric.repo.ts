import { IMetricRepository } from "../../domain/repositories/metric.repo.interface";
import { IEventStore } from "../../abstractions/eventStore.interface";
import { Metric } from "../../domain/aggregates/metric.aggregate";
import { EventSourcedRepository } from "../../abstractions/repo";
import * as MetricEvents from "../../domain/events/metric.events";

export class MetricRepository
  extends EventSourcedRepository<Metric>
  implements IMetricRepository
{
  static createMetricRepository(eventStore: IEventStore): MetricRepository {
    return new MetricRepository(
      eventStore,
      Metric,
      Object.values(MetricEvents)
    );
  }
}
