import { Event } from "../../abstractions/event";
import * as Props from "./metric.eventProps";
import "reflect-metadata";

import { Type } from "class-transformer";

export class MetricCreated extends Event {
  readonly name = MetricCreated.name;

  @Type(() => Props.IMetricCreatedProps)
  readonly props: Props.IMetricCreatedProps;

  constructor(
    occurredOn: Date,
    aggregateId: string,
    props: Props.IMetricCreatedProps,
    order?: number
  ) {
    super(occurredOn, aggregateId, order ?? 1);
    this.props = props;
  }
}

export class MetricDetailsUpdated extends Event {
  readonly name = MetricDetailsUpdated.name;
  @Type(() => Props.IMetricDetailsUpdatedProps)
  readonly props: Props.IMetricDetailsUpdatedProps;
  constructor(
    occurredOn: Date,
    aggregateId: string,
    props: Props.IMetricDetailsUpdatedProps,
    order: number
  ) {
    super(occurredOn, aggregateId, order);
    this.props = props;
  }
}

export class MetricTargetUpdated extends Event {
  readonly name = MetricTargetUpdated.name;

  @Type(() => Props.IMetricTargetUpdatedProps)
  readonly props: Props.IMetricTargetUpdatedProps;
  constructor(
    occurredOn: Date,
    aggregateId: string,
    props: Props.IMetricTargetUpdatedProps,
    order: number
  ) {
    super(occurredOn, aggregateId, order);
    this.props = props;
  }
}

export class MetricDeadlineUpdated extends Event {
  readonly name = MetricDeadlineUpdated.name;
  @Type(() => Props.IMetricDeadlineUpdatedProps)
  readonly props: Props.IMetricDeadlineUpdatedProps;
  constructor(
    occurredOn: Date,
    aggregateId: string,
    props: Props.IMetricDeadlineUpdatedProps,
    order: number
  ) {
    super(occurredOn, aggregateId, order);
    this.props = props;
  }
}

export class MetricValueUpdated extends Event {
  readonly name = MetricValueUpdated.name;

  @Type(() => Props.IMetricValueUpdatedProps)
  readonly props: Props.IMetricValueUpdatedProps;
  constructor(
    occurredOn: Date,
    aggregateId: string,
    props: Props.IMetricValueUpdatedProps,
    order: number
  ) {
    super(occurredOn, aggregateId, order);
    this.props = props;
  }
}
