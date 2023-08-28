import { AggregateRoot } from "../../abstractions/aggregateRoot";
import {
  MetricCreated,
  MetricDetailsUpdated,
  MetricTargetUpdated,
  MetricDeadlineUpdated,
  MetricValueUpdated,
} from "../events/metric.events";

export class Metric extends AggregateRoot {
  private name: string;
  private description: string;
  private value: number;
  private target: number;
  private deadline: Date;
  private unit: string;

  constructor(id: string, creationEvent: MetricCreated) {
    super(id);
    this.registerHandler(MetricDetailsUpdated, this.onMetricDetailsUpdated);
    this.registerHandler(MetricTargetUpdated, this.onMetricTargetUpdated);
    this.registerHandler(MetricDeadlineUpdated, this.onMetricDeadlineUpdated);
    this.registerHandler(MetricValueUpdated, this.onMetricValueUpdated);

    this.name = creationEvent.props.name;
    this.description = creationEvent.props.description;
    this.target = creationEvent.props.target;
    this.unit = creationEvent.props.unit;
    this.value = 0;
    this.deadline = creationEvent.props.deadline;

    this.applyEvent(creationEvent, true);
  }

  get currentDeadline(): Date {
    return this.deadline;
  }
  isAchieved(): boolean {
    return this.value >= this.target;
  }
  onMetricDetailsUpdated(event: MetricDetailsUpdated) {
    this.name = event.props.name;
    this.description = event.props.description;
    this.unit = event.props.unit;
  }
  onMetricTargetUpdated(event: MetricTargetUpdated) {
    if (event.props.target < this.value) {
      this.abortStateChange("A target can't be set smaller than the value");
    }
    this.target = event.props.target;
  }
  onMetricDeadlineUpdated(event: MetricDeadlineUpdated) {
    this.deadline = event.props.deadline;
  }
  onMetricValueUpdated(event: MetricValueUpdated) {
    if (event.props.value < this.value) {
      this.abortStateChange("A metric value can't be decreased");
    }
    this.value = event.props.value;
  }
}
