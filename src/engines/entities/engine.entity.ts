import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Boat } from '../../boats/entities/boat.entity';

@Entity()
export class Engine {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  power: number;

  @Column()
  model: string;

  @Column()
  maker: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne((type) => Boat, (boat) => boat.engines, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  boat: Boat;
}
