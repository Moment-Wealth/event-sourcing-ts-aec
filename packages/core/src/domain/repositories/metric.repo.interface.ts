import { Metric } from "../aggregates/metric.aggregate";
import { IRepository } from "../../abstractions/repository.interface";
export interface IMetricRepository extends IRepository<Metric> {}
