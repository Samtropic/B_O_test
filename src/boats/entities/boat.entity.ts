import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Engine } from '../../engines/entities/engine.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Boat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  length: number;

  @Column()
  width: number;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne((type) => User, (user) => user.boats, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
  })
  user: User;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @OneToMany((type) => Engine, (engine) => engine.boat, {
    cascade: true,
    eager: true,
  })
  engines: Engine[];
}
