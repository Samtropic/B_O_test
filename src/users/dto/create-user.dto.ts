import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsStrongPassword,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateBoatDto } from '../../boats/dto/create-boat.dto';

function trimString({ value }: any): string {
  return typeof value === 'string' ? value.trim() : value;
}

function toLowerCase({ value }: any): string {
  return typeof value === 'string' ? value.toLowerCase() : value;
}

export class CreateUserDto {
  @ApiProperty({ description: 'Firstname of the user.' })
  @Matches("^(?:[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ' -]{1,}|[a-zA-ZÀ-ÿ]+)$")
  @MinLength(2)
  @MaxLength(50)
  @Transform(trimString)
  @Transform(toLowerCase)
  firstname: string;

  @ApiProperty({ description: 'Lastname of the user.' })
  @Matches("^(?:[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ' -]{1,}|[a-zA-ZÀ-ÿ]+)$")
  @MinLength(2)
  @MaxLength(50)
  @Transform(trimString)
  @Transform(toLowerCase)
  lastname: string;

  @ApiProperty({ description: 'Email of the user.' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Password of the user (must be strong).' })
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({
    description: 'Boats owned by the user.',
    isArray: true,
    type: () => CreateBoatDto,
  })
  @ValidateNested()
  @IsArray()
  @Type(() => CreateBoatDto)
  @IsOptional()
  boats?: CreateBoatDto[];
}
