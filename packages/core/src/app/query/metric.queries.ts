import { Query } from "../../abstractions/query";

export class GetMetricsById extends Query {
  readonly name = GetMetricsById.name;
  constructor(metricId: string) {
    super({ metricId });
  }
}

export class GetMetricsByExpiration extends Query {
  readonly name = GetMetricsByExpiration.name;
  constructor(isExpired: boolean) {
    super({ isExpired });
  }
}

export class GetMetricsBySuccess extends Query {
  readonly name = GetMetricsBySuccess.name;
  constructor(isSuccessful: boolean) {
    super({ isSuccessful });
  }
}
