/* eslint-disable @typescript-eslint/no-explicit-any */
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from 'src/modules/user/entities';
import { BaseEntity } from 'src/core/entities';
import { ActionType } from '../enums/action-type.enum';

@Entity('action_logs')
export class ActionLog extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @Column({
    type: 'enum',
    enum: ActionType,
    name: 'action_type',
  })
  actionType: ActionType;

  @Column()
  module: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'ip_address', nullable: true })
  ipAddress: string;

  @Column({ name: 'user_agent', nullable: true })
  userAgent: string;

  @Column({ name: 'related_entity_id', nullable: true })
  relatedEntityId?: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
