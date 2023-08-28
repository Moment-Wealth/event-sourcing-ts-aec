import { Module } from "@nestjs/common";
import { DynamoEventStore } from "@monorepo/core/src/infra/stores/dynamoEventStore";

@Module({
  providers: [
    {
      provide: DynamoEventStore,
      useFactory: async () => {
        const connection = await new DynamoEventStore(
          "EventSourcingStack-EventStore165FCE28-17HQC24YHYNXV"
        );
        return connection;
      },
    },
  ],
  exports: [DynamoEventStore],
})
export class DynamoModule {}
