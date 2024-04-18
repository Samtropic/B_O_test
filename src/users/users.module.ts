import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Boat } from '../boats/entities/boat.entity';
import { Engine } from '../engines/entities/engine.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Boat, Engine])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
