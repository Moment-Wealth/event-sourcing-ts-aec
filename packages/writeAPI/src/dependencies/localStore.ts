import { Module } from "@nestjs/common";
import { LocalEventStore } from "@monorepo/core/src/infra/stores/localEventStore";
import { DynamoEventStore } from "@monorepo/core/src/infra/stores/dynamoEventStore";

@Module({
  providers: [LocalEventStore],
  exports: [LocalEventStore],
})
export class LocalStoreModule {}
