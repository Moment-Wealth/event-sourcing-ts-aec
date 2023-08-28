export class AggregateValidationError extends Error {
  name: string = "AggregateValidationError";
  constructor(message: string) {
    super(message);
  }
}
