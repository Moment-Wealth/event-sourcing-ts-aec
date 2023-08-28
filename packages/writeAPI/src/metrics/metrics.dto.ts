import { Type } from "class-transformer";
import {
  IsAlpha,
  IsDateString,
  IsLowercase,
  IsPositive,
} from "class-validator";
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsObject,
  ValidateNested,
} from "class-validator";

class CreateCommandPropsDTO {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
  @IsNotEmpty()
  @IsString()
  readonly description: string;
  @IsNotEmpty()
  @IsNumber()
  readonly target: number;
  @IsNotEmpty()
  @IsString()
  @IsAlpha()
  @IsLowercase()
  readonly unit: string;
  @IsNotEmpty()
  @IsDateString()
  readonly deadline: string;
}
class UpdateCommandDetailsPropsDTO {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
  @IsNotEmpty()
  @IsString()
  readonly description: string;
  @IsNotEmpty()
  @IsString()
  readonly unit: number;
}
class UpdateCommandTargetPropsDTO {
  @IsNotEmpty()
  @IsNumber()
  readonly target: number;
}
class UpdateCommandDeadlinePropsDTO {
  @IsNotEmpty()
  @IsDateString()
  readonly deadline: string;
}
class UpdateCommandValuePropsDTO {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly value: number;
}
class UpdateCommandDTO {
  @IsNotEmpty()
  @IsString()
  readonly id: string;
  @IsNotEmpty()
  @IsNumber()
  readonly aggregateVersion: number;
  @IsNotEmpty()
  @IsObject()
  readonly props: Object;
}
class CreateCommandDTO {
  @IsNotEmpty()
  @ValidateNested()
  @IsObject()
  readonly props: Object;
}
export class CreateMetricCommandDTO extends CreateCommandDTO {
  @ValidateNested()
  @Type(() => CreateCommandPropsDTO)
  readonly props: CreateCommandPropsDTO;
}
export class UpdateMetricCommandDTO extends UpdateCommandDTO {
  @ValidateNested()
  @Type(() => UpdateCommandDetailsPropsDTO)
  readonly props: UpdateCommandDetailsPropsDTO;
}
export class UpdateMetricTargetCommandDTO extends UpdateCommandDTO {
  @ValidateNested()
  @Type(() => UpdateCommandTargetPropsDTO)
  readonly props: UpdateCommandTargetPropsDTO;
}
export class UpdateMetricDeadlineCommandDTO extends UpdateCommandDTO {
  @ValidateNested()
  @Type(() => UpdateCommandDeadlinePropsDTO)
  readonly props: UpdateCommandDeadlinePropsDTO;
}
export class UpdateMetricValueCommandDTO extends UpdateCommandDTO {
  @ValidateNested()
  @Type(() => UpdateCommandValuePropsDTO)
  readonly props: UpdateCommandValuePropsDTO;
}
