export class ConcurrencyError extends Error {
  name: string = "ConcurrencyError";
  constructor(message: string) {
    super(message);
  }
}
export class WrongIdentifierError extends Error {
  name: string = "WrongIdentifierError";
  constructor(message: string) {
    super(message);
  }
}
