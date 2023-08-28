import { Module } from "@nestjs/common";
import { DynamoEventStore } from "@monorepo/core/src/infra/stores/dynamoEventStore";
import { MetricRepository } from "@monorepo/core/src/app/repositories/metric.repo";
import { DynamoModule } from "src/dependencies/dynamoStore.module";
@Module({
  imports: [DynamoModule],
  providers: [
    {
      provide: "MetricRepository",
      useFactory: (eventStore: DynamoEventStore) =>
        MetricRepository.createMetricRepository(eventStore),
      inject: [DynamoEventStore],
    },
  ],
  exports: ["MetricRepository"],
})
export class RepositoriesModule {}
