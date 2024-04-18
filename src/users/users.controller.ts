import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { ExcludePasswordInterceptor } from '../common/interceptors/exclude-password/exclude-password.interceptor';
import { Boat } from '../boats/entities/boat.entity';
import { CreateBoatDto } from '../boats/dto/create-boat.dto';

@ApiTags('Users 👥')
@Controller('users')
@UseInterceptors(ExcludePasswordInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({
    isArray: true,
    type: CreateUserDto,
    description: 'OK',
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one user by his id' })
  @ApiOkResponse({
    type: CreateUserDto,
    description: 'OK',
  })
  @ApiNotFoundResponse({
    description: 'Not Found',
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Get('/:id/boats')
  @ApiOkResponse({
    isArray: true,
    type: CreateBoatDto,
    description: 'OK',
  })
  @ApiNotFoundResponse({
    description: 'Not Found',
  })
  async getBoats(@Param('id') userId: number): Promise<Boat[]> {
    return await this.usersService.findBoatsByUserId(userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Edit one user' })
  @ApiOkResponse({
    type: CreateUserDto,
    description: 'OK',
  })
  @ApiNotFoundResponse({
    description: 'Not Found',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete one user' })
  @ApiOkResponse({
    type: CreateUserDto,
    description: 'OK',
  })
  @ApiNotFoundResponse({
    description: 'Not Found',
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
