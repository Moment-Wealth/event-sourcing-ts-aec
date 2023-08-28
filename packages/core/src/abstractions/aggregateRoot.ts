import { v4 as uuid } from "uuid";
import { Event } from "./event";
import { AggregateValidationError } from "../domain/errors/domain.errors";

export abstract class AggregateRoot {
  readonly id: string;
  private version: number = 0;
  protected events: Event[] = [];
  private handlersMap: { [key: string]: (event: Event) => void } = {};

  constructor(id?: string) {
    this.id = id || uuid();
  }

  get currentVersion(): number {
    return this.version;
  }

  applyEvent(event: Event, isCreationEvent: boolean = false): void {
    if (!isCreationEvent) {
      const handler = this.handlersMap[event.name];
      handler.call(this, event);
    }

    this.version++;
    this.events.push(event);
  }

  registerHandler(
    eventType: new (...args: any[]) => Event,
    handler: (arg: any) => void
  ): void {
    this.handlersMap[eventType.name] = handler;
  }

  commitEvents(): Event[] {
    const events = [...this.events];
    this.events = [];
    return events;
  }
  protected abortStateChange(reason: string) {
    throw new AggregateValidationError(reason);
  }
}
