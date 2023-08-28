import { Metric } from "../../domain/aggregates/metric.aggregate";
import { IMetricRepository } from "../../domain/repositories/metric.repo.interface";
import { CommandHandler } from "../../abstractions/commandHandler";

import {
  MetricCreated,
  MetricDetailsUpdated,
  MetricTargetUpdated,
  MetricDeadlineUpdated,
  MetricValueUpdated,
} from "../../domain/events/metric.events";
import {
  CreateMetricCommand,
  UpdateMetricDetailsCommand,
  UpdateMetricTargetCommand,
  UpdateMetricDeadlineCommand,
  UpdateMetricValueCommand,
} from "./metric.commands";

export class MetricCommandHandler extends CommandHandler<Metric> {
  creationCommandClass = CreateMetricCommand;
  aggregateClass = Metric;
  constructor(repository: IMetricRepository) {
    super(repository);
    this.registerCommandHandler(
      UpdateMetricDetailsCommand.name,
      this.handleUpdateMetricDetailsCommand
    );
    this.registerCommandHandler(
      UpdateMetricTargetCommand.name,
      this.handleUpdateMetricTargetCommand
    );
    this.registerCommandHandler(
      UpdateMetricDeadlineCommand.name,
      this.handleUpdateMetricDeadlineCommand
    );
    this.registerCommandHandler(
      UpdateMetricValueCommand.name,
      this.handleUpdateMetricValueCommand
    );
  }

  protected handleCreateCommand = (command: CreateMetricCommand): Metric => {
    if (command.props.deadline < new Date()) {
      this.abortCommand("A deadline can't be lower than today's date");
    }
    return new Metric(
      command.id,
      new MetricCreated(new Date(), command.id, command.props, 1)
    );
  };

  protected handleUpdateMetricDetailsCommand = (
    command: UpdateMetricDetailsCommand,
    metric: Metric
  ): void => {
    metric.applyEvent(
      new MetricDetailsUpdated(
        new Date(),
        command.id,
        command.props,
        command.aggregateVersion + 1
      )
    );
  };

  protected handleUpdateMetricTargetCommand = (
    command: UpdateMetricTargetCommand,
    metric: Metric
  ): void => {
    if (metric.currentDeadline < new Date()) {
      this.abortCommand("A target can't be changed after the deadline");
    }
    metric.applyEvent(
      new MetricTargetUpdated(
        new Date(),
        command.id,
        command.props,
        command.aggregateVersion + 1
      )
    );
  };

  protected handleUpdateMetricDeadlineCommand = (
    command: UpdateMetricDeadlineCommand,
    metric: Metric
  ): void => {
    if (command.props.deadline < new Date()) {
      this.abortCommand("A deadline can't be lower than today's date");
    }
    metric.applyEvent(
      new MetricDeadlineUpdated(
        new Date(),
        command.id,
        command.props,
        command.aggregateVersion + 1
      )
    );
  };

  protected handleUpdateMetricValueCommand = (
    command: UpdateMetricValueCommand,
    metric: Metric
  ): void => {
    if (metric.currentDeadline < new Date()) {
      this.abortCommand("Value can't be updated after the deadline");
    }
    let wasAchieved = metric.isAchieved();
    metric.applyEvent(
      new MetricValueUpdated(
        new Date(),
        command.id,
        command.props,
        command.aggregateVersion + 1
      )
    );
    if (!wasAchieved && metric.isAchieved()) {
      //TODO do some side effect
    }
  };
}
