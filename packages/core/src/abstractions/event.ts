interface IEventProps {
  readonly [key: string]: any;
}

export abstract class Event {
  abstract readonly name: string;
  abstract props: IEventProps;
  readonly occurredOn: Date;
  readonly aggregateId: string;
  readonly order: number;

  constructor(occurredOn: Date, aggregateId: string, order: number) {
    this.occurredOn = occurredOn;
    this.aggregateId = aggregateId;
    this.order = order;
  }
}

export class DeserializedEvent extends Event {
  readonly name: string;
  readonly props: IEventProps;

  constructor(
    occurredOn: string,
    aggregateId: string,
    order: number,
    name: string,
    props: IEventProps
  ) {
    super(new Date(occurredOn), aggregateId, order);
    this.name = name;
    this.props = props;
  }
}
