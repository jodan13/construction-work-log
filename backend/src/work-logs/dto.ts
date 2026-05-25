import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWorkLogDto {
  @IsDateString()
  workDate!: string;

  @IsInt()
  @Type(() => Number)
  workTypeId!: number;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  volume!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  unit!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(120)
  performerName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  comment?: string;
}

export class UpdateWorkLogDto {
  @IsOptional()
  @IsDateString()
  workDate?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  workTypeId?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  volume?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  unit?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  performerName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  comment?: string;
}

export class WorkLogFiltersDto {
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}
