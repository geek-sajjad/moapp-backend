import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/core/entities';
import { AutoMap } from '@automapper/classes';
import { ContactEntity } from 'src/modules/contact/entities';
import { TransactionTypeEnum } from '../enums';

@Entity('transactions')
export class TransactionEntity extends BaseEntity {
  @AutoMap()
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @AutoMap()
  @Column({ type: 'date' })
  date: Date;

  @AutoMap()
  @Column({
    type: 'enum',
    enum: TransactionTypeEnum,
  })
  type: TransactionTypeEnum;

  @AutoMap()
  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'contact_id' })
  contactId: string;

  @AutoMap()
  @ManyToOne(() => ContactEntity, (contact) => contact.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'contact_id' })
  contact: ContactEntity;
}
