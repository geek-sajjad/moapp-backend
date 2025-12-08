import { AutoMap } from '@automapper/classes';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('images')
export class ImageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column()
  url: string;

  @AutoMap()
  @Column('varchar', {
    length: 100,
  })
  altText: string;
}
