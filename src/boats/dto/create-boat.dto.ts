import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { EngineDto } from '../../engines/dto/engine.dto';

export class CreateBoatDto {
  @ApiProperty({ description: 'Name of the boat.' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Length of the boat.' })
  @IsNotEmpty()
  @IsPositive()
  length: number;

  @ApiProperty({ description: 'Width of the boat.' })
  @IsNotEmpty()
  @IsPositive()
  width: number;

  @ApiPropertyOptional({
    description: 'Engine(s) of the boat.',
    isArray: true,
    type: () => EngineDto,
  })
  @ValidateNested()
  @IsArray()
  @Type(() => EngineDto)
  @IsOptional()
  engines?: EngineDto[];
}
