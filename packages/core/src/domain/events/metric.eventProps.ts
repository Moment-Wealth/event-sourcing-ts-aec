import { Type } from "class-transformer";
import "reflect-metadata";

export class IMetricCreatedProps {
  @Type(() => Date)
  readonly deadline: Date;
  constructor(
    readonly name: string,
    readonly description: string,
    readonly target: number,
    readonly unit: string,
    deadline: Date
  ) {
    this.deadline = deadline;
  }
}

export class IMetricTargetUpdatedProps {
  constructor(readonly target: number) {}
}

export class IMetricDetailsUpdatedProps {
  constructor(
    readonly name: string,
    readonly description: string,
    readonly unit: string
  ) {}
}

export class IMetricValueUpdatedProps {
  constructor(readonly value: number) {}
}

export class IMetricDeadlineUpdatedProps {
  @Type(() => Date)
  readonly deadline: Date;
  constructor(deadline: Date) {
    this.deadline = deadline;
  }
}
