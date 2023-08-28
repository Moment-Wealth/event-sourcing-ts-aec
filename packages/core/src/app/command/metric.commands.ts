import {
  IMetricCreatedProps as MetricCreatedProps,
  IMetricDetailsUpdatedProps as MetricDetailsUpdatedProps,
  IMetricDeadlineUpdatedProps as MetricDeadlineUpdatedProps,
  IMetricValueUpdatedProps as MetricValueUpdatedProps,
  IMetricTargetUpdatedProps as MetricTargetUpdatedProps,
} from "domain/events/metric.eventProps";
import { Command } from "../../abstractions/command";

export class CreateMetricCommand extends Command<MetricCreatedProps> {
  constructor(props: MetricCreatedProps) {
    super(CreateMetricCommand.name, props);
  }
}

export class UpdateMetricDetailsCommand extends Command<MetricDetailsUpdatedProps> {
  readonly name = UpdateMetricDetailsCommand.name;
  constructor(id: string, props: MetricDetailsUpdatedProps, version: number) {
    super(UpdateMetricDetailsCommand.name, props, id, version);
  }
}

export class UpdateMetricTargetCommand extends Command<MetricTargetUpdatedProps> {
  readonly name = UpdateMetricTargetCommand.name;
  constructor(id: string, props: MetricTargetUpdatedProps, version: number) {
    super(UpdateMetricTargetCommand.name, props, id, version);
  }
}

export class UpdateMetricDeadlineCommand extends Command<MetricDeadlineUpdatedProps> {
  readonly name = UpdateMetricDeadlineCommand.name;
  constructor(id: string, props: MetricDeadlineUpdatedProps, version: number) {
    super(UpdateMetricDeadlineCommand.name, props, id, version);
  }
}

export class UpdateMetricValueCommand extends Command<MetricValueUpdatedProps> {
  readonly name = UpdateMetricValueCommand.name;
  constructor(id: string, props: MetricValueUpdatedProps, version: number) {
    super(UpdateMetricValueCommand.name, props, id, version);
  }
}
