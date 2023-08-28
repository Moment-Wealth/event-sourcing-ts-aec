import { Module } from "@nestjs/common";
import { MetricsController } from "./metrics.controller";
import { MetricCommandHandler } from "@monorepo/core/src/app/command/metric.commandHandler";
import { MetricRepository } from "@monorepo/core/src/app/repositories/metric.repo";
import { RepositoriesModule } from "./metrics.repository.module";

@Module({
  imports: [RepositoriesModule],
  providers: [
    {
      provide: "MetricCommandHandler",
      useFactory: (metricRepository: MetricRepository) =>
        new MetricCommandHandler(metricRepository),
      inject: ["MetricRepository"],
    },
  ],
  controllers: [MetricsController],
})
export class MetricsModule {}
