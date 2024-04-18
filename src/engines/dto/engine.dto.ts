import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class EngineDto {
  @ApiProperty({ description: 'Power of the engine.' })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  power: number;

  @ApiProperty({ description: 'Model of the engine.' })
  @IsNotEmpty()
  @IsString()
  model: string;

  @ApiProperty({ description: "Engine's maker." })
  @IsNotEmpty()
  @IsString()
  maker: string;
}
