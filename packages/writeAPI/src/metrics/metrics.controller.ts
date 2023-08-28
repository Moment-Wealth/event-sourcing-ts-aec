import {
  Body,
  Controller,
  Post,
  Inject,
  BadRequestException,
  Param,
} from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { MetricCommandHandler } from "@monorepo/core/src/app/command/metric.commandHandler";
import {
  CreateMetricCommand,
  UpdateMetricDetailsCommand,
  UpdateMetricDeadlineCommand,
  UpdateMetricTargetCommand,
  UpdateMetricValueCommand,
} from "@monorepo/core/src/app/command/metric.commands";

import {
  CreateMetricCommandDTO,
  UpdateMetricCommandDTO,
  UpdateMetricTargetCommandDTO,
  UpdateMetricDeadlineCommandDTO,
  UpdateMetricValueCommandDTO,
} from "./metrics.dto";

const createCommandValidator =
  (commandClass: any, CommandDTOClass: any) => async (requestBody: any) => {
    const commandDTO = plainToInstance(CommandDTOClass, requestBody);
    const errors = await validate(commandDTO, { whitelist: true });
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    const command = plainToInstance(commandClass, commandDTO);
    return command;
  };

@Controller({ path: "metrics" })
export class MetricsController {
  private commandValidatorMap: Record<string, any> = {};

  constructor(
    @Inject("MetricCommandHandler")
    private readonly metricCommandHandler: MetricCommandHandler
  ) {
    this.commandValidatorMap[CreateMetricCommand.name] = createCommandValidator(
      CreateMetricCommand,
      CreateMetricCommandDTO
    );
    this.commandValidatorMap[UpdateMetricDetailsCommand.name] =
      createCommandValidator(
        UpdateMetricDetailsCommand,
        UpdateMetricCommandDTO
      );
    this.commandValidatorMap[UpdateMetricTargetCommand.name] =
      createCommandValidator(
        UpdateMetricTargetCommand,
        UpdateMetricTargetCommandDTO
      );
    this.commandValidatorMap[UpdateMetricDeadlineCommand.name] =
      createCommandValidator(
        UpdateMetricDeadlineCommand,
        UpdateMetricDeadlineCommandDTO
      );
    this.commandValidatorMap[UpdateMetricValueCommand.name] =
      createCommandValidator(
        UpdateMetricValueCommand,
        UpdateMetricValueCommandDTO
      );
  }

  @Post("/:command")
  async postMetricCommand(
    @Param("command") commandName: string,
    @Body() data: any
  ) {
    const commandValidator = this.commandValidatorMap[commandName];
    if (!commandValidator) {
      throw new BadRequestException(`Invalid command not found: ${data.name}`);
    }
    const command = await commandValidator(data);
    return this.metricCommandHandler.handle(command);
  }
}
