import { v4 as uuid } from "uuid";

export abstract class Command<P = any> {
  name: string;
  id: string;
  aggregateVersion: number;
  props: P;
  constructor(name: string, props: P, id?: string, version?: number) {
    this.name = name;
    this.props = props;
    this.id = id || uuid();
    this.aggregateVersion = version || 0;
  }
}
