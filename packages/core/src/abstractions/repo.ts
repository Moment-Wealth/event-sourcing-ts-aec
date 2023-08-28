import { IRepository } from "./repository.interface";
import { AggregateRoot } from "./aggregateRoot";
import { IEventStore } from "./eventStore.interface";
import { Event } from "./event";
import { EventsIO } from "./events.io";

export abstract class EventSourcedRepository<A extends AggregateRoot>
  implements IRepository<A>
{
  private eventsIO = new EventsIO([]);
  constructor(
    protected readonly eventStore: IEventStore,
    private aggregateClass: new (id: string, event: any) => A,
    eventClasses: (new (...args: any) => Event)[]
  ) {
    this.eventsIO.registerEvents(eventClasses);
  }

  async save(aggregate: A, oldVersion: number): Promise<void> {
    const events = aggregate.commitEvents();
    const eventsToAppend = this.eventsIO.plainifyEvents(
      events.slice(oldVersion)
    );
    await this.eventStore.appendEvents(aggregate.id, eventsToAppend);
  }
  async get(id: string, version: number): Promise<A> {
    const rawEvents = await this.eventStore.getEventStream(id, version);
    const events = this.eventsIO.instantiateEvents(rawEvents);

    const aggregate = new this.aggregateClass(id, events[0]);

    for (let i = 1; i < events.length; i++) {
      aggregate.applyEvent(events[i]);
    }
    return aggregate;
  }
}
