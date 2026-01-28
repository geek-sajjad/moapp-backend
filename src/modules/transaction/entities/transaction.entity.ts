import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/core/entities';
import { AutoMap } from '@automapper/classes';
import { CustomerEntity } from 'src/modules/customer/entities';
import { UserEntity } from 'src/modules/user/entities';

@Entity('transactions')
export class TransactionEntity extends BaseEntity {
  @AutoMap()
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  debitAmount: number;

  @AutoMap()
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  creditAmount: number;

  @AutoMap()
  @Column({ type: 'date' })
  date: Date;

  @AutoMap()
  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'user_id' })
  userId: string;

  @AutoMap()
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'customer_id' })
  customerId: string;

  @AutoMap()
  @ManyToOne(() => CustomerEntity, (customer) => customer.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer: CustomerEntity;
}
