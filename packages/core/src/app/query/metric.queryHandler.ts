import { QueryHandler } from "../../abstractions/query";
import { Db } from "mongodb";
import {
  GetMetricsById,
  GetMetricsByExpiration,
  GetMetricsBySuccess,
} from "./metric.queries";

export class MetricQueryHandler extends QueryHandler {
  private db: Db;
  constructor(db: Db) {
    super();
    this.db = db;
    this.registerQueryHandler(GetMetricsById.name, this.handleGetMetricById);
    this.registerQueryHandler(
      GetMetricsByExpiration.name,
      this.handleGetMetricsByExpiration
    );
    this.registerQueryHandler(
      GetMetricsBySuccess.name,
      this.handleGetMetricsBySuccess
    );
  }

  protected handleGetMetricById = (query: GetMetricsById): Promise<any> => {
    const { metricId } = query.params;
    const collection = this.db.collection("Metrics");
    return collection.findOne({ _id: metricId });
  };

  protected handleGetMetricsByExpiration = (
    query: GetMetricsByExpiration
  ): Promise<any> => {
    const { isExpired } = query.params;
    const collection = this.db.collection("Metrics");
    return collection
      .find({
        deadline: isExpired ? { $lt: new Date() } : { $gte: new Date() },
      })
      .toArray();
  };

  protected handleGetMetricsBySuccess = (
    query: GetMetricsBySuccess
  ): Promise<any> => {
    const { isSuccessful } = query.params;
    const collection = this.db.collection("Metrics");

    const exp = isSuccessful
      ? {
          $expr: {
            $gte: [{ $arrayElemAt: ["$values", -1] }, "$target"],
          },
        }
      : {
          $expr: {
            $lt: [{ $arrayElemAt: ["$values", -1] }, "$target"],
          },
        };

    return collection.find(exp).toArray();
  };
}
