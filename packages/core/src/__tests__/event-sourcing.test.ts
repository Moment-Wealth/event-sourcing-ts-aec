import { LocalEventStore } from "../infra/stores/localEventStore";
import { MetricCommandHandler } from "../app/command/metric.commandHandler";
import { MetricRepository } from "../app/repositories/metric.repo";
import { MetricCreated } from "domain/events/metric.events";
import { v4 as uuid } from "uuid";
import {
  CreateMetricCommand,
  UpdateMetricDetailsCommand,
  UpdateMetricTargetCommand,
  UpdateMetricDeadlineCommand,
  UpdateMetricValueCommand,
} from "app/command/metric.commands";

describe("DynamoDB EventStore", () => {
  const eventStore = new LocalEventStore();
  const aggregateId = uuid();
  it("should append events", async () => {
    await eventStore.appendEvents(aggregateId, [
      new MetricCreated(
        new Date(),
        aggregateId,
        {
          name: "Oake",
          description: "Fake",
          target: 13,
          unit: "as",
          deadline: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        },
        1
      ),
      new MetricCreated(
        new Date(),
        aggregateId,
        {
          name: "Oake",
          description: "Fake",
          target: 13,
          unit: "as",
          deadline: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        },
        2
      ),
    ]);
  });

  it("should get events", async () => {
    const events = await eventStore.getEventStream(aggregateId, 2);
    expect(events.length).toBe(2);
    expect(events[0].order).toBe(1);
    expect(events[1].order).toBe(2);
  });

  it("should throw assert error for wrong id", async () => {
    const wrongId = "wrongId";
    await expect(eventStore.getEventStream(wrongId, 1)).rejects.toThrowError();
  });

  it("should throw error for outdated version", async () => {
    await expect(
      eventStore.getEventStream(aggregateId, 1)
    ).rejects.toThrowError();
  });

  it("should throw error for non existant version", async () => {
    await expect(
      eventStore.getEventStream(aggregateId, 3)
    ).rejects.toThrowError();
  });

  it("should thtrow  error if inserting an event with an outdated order", async () => {
    await expect(
      eventStore.appendEvents(aggregateId, [
        new MetricCreated(
          new Date(),
          aggregateId,
          {
            name: "Oake",
            description: "Fake",
            target: 13,
            unit: "as",
            deadline: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
          },
          1
        ),
      ])
    ).rejects.toThrowError();
  });
});

describe("Metric command handler", () => {
  const eventStore = new LocalEventStore();
  const metricRepository = MetricRepository.createMetricRepository(eventStore);
  const metricCommandHandler = new MetricCommandHandler(metricRepository);
  let result: any;
  it("should create metric", async () => {
    const createCommand = new CreateMetricCommand({
      name: "Users",
      description: "How many users",
      target: 15,
      unit: "users",
      deadline: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    });
    result = await metricCommandHandler.handle(createCommand);

    expect(result.id).toBeDefined();
    expect(result.version).toBe(1);
    const aggregate = await metricRepository.get(result.id, 1);
    expect(aggregate.currentVersion).toBe(1);
    expect(aggregate.id).toBe(result.id);
  });
  it("should update metric", async () => {
    const updateCommand = new UpdateMetricDetailsCommand(
      result.id,
      {
        unit: "user(s)",
        name: "User(s) Signed Up",
        description: "How many user(s)",
      },
      result.version
    );
    result = await metricCommandHandler.handle(updateCommand);
    const updatedAggregate = await metricRepository.get(
      result.id,
      result.version
    );
    expect(updatedAggregate.currentVersion).toBe(2);
    expect(updatedAggregate.id).toBe(result.id);
    expect((updatedAggregate as any).name).toBe("User(s) Signed Up");
    expect((updatedAggregate as any).description).toBe("How many user(s)");
    expect((updatedAggregate as any).unit).toBe("user(s)");
  });

  it("should update target", async () => {
    const updateCommand = new UpdateMetricTargetCommand(
      result.id,
      {
        target: 20,
      },
      result.version
    );
    result = await metricCommandHandler.handle(updateCommand);
    const updatedAggregate = await metricRepository.get(
      result.id,
      result.version
    );
    expect(updatedAggregate.currentVersion).toBe(3);
    expect(updatedAggregate.id).toBe(result.id);
    expect((updatedAggregate as any).target).toBe(20);
  });

  it("should update deadline", async () => {
    const newDeadline = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    const updateCommand = new UpdateMetricDeadlineCommand(
      result.id,
      {
        deadline: newDeadline,
      },
      result.version
    );
    result = await metricCommandHandler.handle(updateCommand);
    const updatedAggregate = await metricRepository.get(
      result.id,
      result.version
    );
    expect(updatedAggregate.currentVersion).toBe(4);
    expect(updatedAggregate.id).toBe(result.id);
    expect((updatedAggregate as any).deadline).toEqual(newDeadline);
  });

  it("should update value", async () => {
    const updateCommand = new UpdateMetricValueCommand(
      result.id,
      {
        value: 20,
      },
      result.version
    );
    result = await metricCommandHandler.handle(updateCommand);
    const updatedAggregate = await metricRepository.get(
      result.id,
      result.version
    );

    expect(updatedAggregate.currentVersion).toBe(5);
    expect(updatedAggregate.id).toBe(result.id);
    expect((updatedAggregate as any).value).toBe(20);
  });

  it("should throw error when decreasing value", async () => {
    const updateCommand = new UpdateMetricValueCommand(
      result.id,
      {
        value: 10,
      },
      result.version
    );
    await expect(metricCommandHandler.handle(updateCommand)).rejects.toThrow();
  });

  it("should throw error when decreasing target below value", async () => {
    const updateCommand = new UpdateMetricTargetCommand(
      result.id,
      {
        target: 10,
      },
      result.version
    );
    await expect(metricCommandHandler.handle(updateCommand)).rejects.toThrow();
  });

  it("should throw error when decreasing deadline below today", async () => {
    const updateCommand = new UpdateMetricDeadlineCommand(
      result.id,
      {
        deadline: new Date(new Date().getTime() - 1 * 60 * 60 * 1000),
      },
      result.version
    );
    await expect(metricCommandHandler.handle(updateCommand)).rejects.toThrow();
  });

  it("should throw error when updating target or value when the deadline has expired", async () => {
    jest
      .useFakeTimers()
      .setSystemTime(new Date(new Date().getTime() + 24 * 60 * 60 * 1000));

    const updateCommand = new UpdateMetricTargetCommand(
      result.id,
      {
        target: 30,
      },
      result.version
    );
    await expect(metricCommandHandler.handle(updateCommand)).rejects.toThrow();
    const updateCommand2 = new UpdateMetricValueCommand(
      result.id,
      {
        value: 30,
      },
      result.version
    );
    await expect(metricCommandHandler.handle(updateCommand2)).rejects.toThrow();
    jest.useRealTimers();
  });
});
