import { Event } from "./event";

export interface IEventStore {
  appendEvents(aggregateId: string, events: Event[]): Promise<void>;
  getEventStream(aggregateId: string, version: number): Promise<Event[]>;
}
