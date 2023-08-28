import { IEventStore } from "../../abstractions/eventStore.interface";
import { Event } from "../../abstractions/event";

export class LocalEventStore implements IEventStore {
  eventDb: { [aggregateId: string]: Event[] } = {};
  constructor(seedData?: { [aggregateId: string]: Event[] }) {
    if (seedData) {
      this.eventDb = seedData;
    }
  }
  async appendEvents(aggregateId: string, events: Event[]): Promise<void> {
    if (!this.eventDb[aggregateId]) {
      this.eventDb[aggregateId] = [];
      this.eventDb[aggregateId].push(...events);
    } else {
      const lastEvent =
        this.eventDb[aggregateId][this.eventDb[aggregateId].length - 1];
      // make sure order number of the last event one less than the first event we append
      if (lastEvent.order != events[0].order - 1) {
        throw new Error(
          `Last event order number is ${lastEvent.order} but first event order number is ${events[0].order}`
        );
      }
      this.eventDb[aggregateId].push(...events);
    }
  }
  async getEventStream(aggregateId: string, version: number): Promise<Event[]> {
    if (!this.eventDb[aggregateId]) {
      throw new Error(`No events found for aggregate ${aggregateId}`);
    }
    if (
      this.eventDb[aggregateId][this.eventDb[aggregateId].length - 1].order >
      version
    ) {
      throw new Error(
        `Concurrency error: ${aggregateId} version ${version} outdated`
      );
    }
    return this.eventDb[aggregateId];
  }
}
