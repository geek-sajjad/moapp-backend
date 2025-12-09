import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/core/entities';
import { AutoMap } from '@automapper/classes';
import { UserEntity } from './user.entity';

@Entity('user_profiles')
export class UserProfileEntity extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @AutoMap()
  @Column({ nullable: true })
  bio?: string;

  @AutoMap()
  @Column({ nullable: true })
  address?: string;

  @AutoMap()
  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
