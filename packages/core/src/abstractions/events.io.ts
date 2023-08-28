import { Event } from "./event";
import { plainToInstance } from "class-transformer";

export class EventsIO {
  private acceptedEvents = new Map<string, new (event: any) => Event>();
  constructor(eventClasses: (new (...args: any) => Event)[]) {
    this.registerEvents(eventClasses);
  }

  registerEvents(eventClasses: (new (...args: any) => Event)[]) {
    eventClasses.forEach((eventClass) => {
      this.acceptedEvents.set(eventClass.name, eventClass);
    });
  }

  //TODO proper serialization/ typing
  plainifyEvents(events: Event[]): any[] {
    return JSON.parse(JSON.stringify(events));
  }

  instantiateEvents(events: any[]): Event[] {
    return events.map((event) => {
      const eventClass = this.acceptedEvents.get(event.name);
      if (!eventClass) {
        throw new Error(`Event ${event.name} not registered`);
      }
      return plainToInstance(eventClass, event, {
        enableImplicitConversion: true,
        exposeUnsetFields: true,
      });
    });
  }
}
