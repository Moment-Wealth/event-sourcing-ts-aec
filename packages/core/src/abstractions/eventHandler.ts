import { Event } from "./event";
export abstract class EventHandler {
  protected eventHandlerMap: {
    [eventName: string]: (event: any) => Promise<void>;
  } = {};

  async handle(event: Event) {
    if (this.eventHandlerMap[event.name]) {
      return await this.eventHandlerMap[event.name](event);
    } else {
      throw new Error("Event not found: " + event.name);
    }
  }

  abstract backupStrategy(...args: any[]): Promise<any>;

  protected registerEventHandler(
    eventName: string,
    handler: (event: any) => Promise<any>
  ) {
    this.eventHandlerMap[eventName] = handler;
  }
}
