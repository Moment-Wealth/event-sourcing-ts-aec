import { AggregateRoot } from "./aggregateRoot";
import { IRepository } from "./repository.interface";
import { Command } from "./command";
import { CommandHandlerValidationError } from "../app/errors/app.errors";

export abstract class CommandHandler<A extends AggregateRoot> {
  protected commandHandlerMap: {
    [commandName: string]: (command: Command, aggregate: A) => void;
  } = {};
  protected abstract creationCommandClass: new (props: any) => Command;
  protected abstract aggregateClass: new (id: string, event: any) => A;

  constructor(protected readonly repository: IRepository<A>) {}

  protected abstract handleCreateCommand(command: Command): A;

  abortCommand(reason: string): void {
    throw new CommandHandlerValidationError(reason);
  }

  async handle(command: Command): Promise<{ id: string; version: number }> {
    if (command.name == this.creationCommandClass.name) {
      const aggregate = this.handleCreateCommand(command);
      await this.repository.save(aggregate, command.aggregateVersion);

      return { id: command.id, version: aggregate.currentVersion };
    } else if (this.commandHandlerMap[command.name]) {
      const aggregate = await this.repository.get(
        command.id,
        command.aggregateVersion
      );

      this.commandHandlerMap[command.name](command, aggregate);
      await this.repository.save(aggregate, command.aggregateVersion);
      return { id: command.id, version: aggregate.currentVersion };
    } else {
      throw new CommandHandlerValidationError(
        `Command not found: ${command.name}, on aggregate ${this.aggregateClass.name}`
      );
    }
  }

  protected registerCommandHandler(
    commandName: string,
    handler: (command: Command, aggregate: A) => void
  ) {
    this.commandHandlerMap[commandName] = handler;
  }
}
