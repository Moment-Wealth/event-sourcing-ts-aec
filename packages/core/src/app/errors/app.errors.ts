export class CommandHandlerValidationError extends Error {
  name: string = "CommandHandlerValidationError";
  constructor(message: string) {
    super("Invalid Command-" + message);
  }
}
