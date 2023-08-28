import { Module } from "@nestjs/common";
import { MetricsController } from "./metrics.controller";
import { MetricQueryHandler } from "@monorepo/core/src/app/query/metric.queryHandler";
import { MongoDBModule } from "../dependencies/db.module";

@Module({
  imports: [MongoDBModule],
  providers: [
    {
      provide: "MetricQueryHandler",
      useFactory: (mongoDB: any) => new MetricQueryHandler(mongoDB),
      inject: ["MongoDB"],
    },
  ],
  controllers: [MetricsController],
})
export class MetricsModule {}
