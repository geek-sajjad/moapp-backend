import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/core/entities';
import { AutoMap } from '@automapper/classes';
import { UserEntity } from 'src/modules/user/entities';
import { TransactionEntity } from 'src/modules/transaction/entities';

@Entity('customers')
export class CustomerEntity extends BaseEntity {
  @AutoMap()
  @Column()
  name: string;

  @AutoMap()
  @Column({ type: 'text', nullable: true })
  description?: string;

  @AutoMap()
  @Column({ name: 'phone_number', nullable: true })
  phoneNumber?: string;

  @AutoMap()
  @Column({ name: 'is_archived', default: false })
  isArchived: boolean;

  @Column({ name: 'user_id' })
  userId: string;

  @AutoMap()
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.customer)
  transactions: TransactionEntity[];
}
