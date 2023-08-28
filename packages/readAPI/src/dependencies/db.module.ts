import { Module } from "@nestjs/common";
import { getMongoDB } from "@monorepo/core/src/infra/dbs/mongodb";

@Module({
  providers: [
    {
      provide: "MongoDB",
      useFactory: async () => {
        const connection = await getMongoDB();
        return connection;
      },
    },
  ],
  exports: ["MongoDB"],
})
export class MongoDBModule {}
