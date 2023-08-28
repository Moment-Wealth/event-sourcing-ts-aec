import {
  Controller,
  Query as QueryParam,
  Param,
  Get,
  Inject,
  NotFoundException,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { MetricQueryHandler } from "@monorepo/core/src/app/query/metric.queryHandler";

@UsePipes(
  new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  })
)
@Controller({ path: "metrics" })
export class MetricsController {
  constructor(
    @Inject("MetricQueryHandler")
    private readonly metricQueryHandler: MetricQueryHandler
  ) {}

  @Get("GetMetricsByExpiration")
  async getMetricsByExpiration(@QueryParam("isExpired") isExpired: boolean) {
    const query = {
      name: "GetMetricsByExpiration",
      params: { isExpired },
    };

    const result = await this.metricQueryHandler.handle(query);
    if (result) {
      return result;
    } else {
      throw new NotFoundException("Query returned no results");
    }
  }
  @Get("GetMetricsById")
  async getMetricsById(@QueryParam("metricId") metricId) {
    const query = {
      name: "GetMetricsById",
      params: { metricId },
    };

    const result = await this.metricQueryHandler.handle(query);
    if (result) {
      return result;
    } else {
      throw new NotFoundException("Query returned no results");
    }
  }
  @Get("GetMetricsBySuccess")
  async getMetricsBySuccess(@QueryParam("isSuccessful") isSuccessful: boolean) {
    const query = {
      name: "GetMetricsBySuccess",
      params: { isSuccessful },
    };

    const result = await this.metricQueryHandler.handle(query);
    if (result) {
      return result;
    } else {
      throw new NotFoundException("Query returned no results");
    }
  }
}
