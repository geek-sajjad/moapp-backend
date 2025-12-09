import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/core/entities';
import { AutoMap } from '@automapper/classes';
import { UserEntity } from 'src/modules/user/entities';
import { TransactionEntity } from 'src/modules/transaction/entities';

@Entity('contacts')
export class ContactEntity extends BaseEntity {
  @AutoMap()
  @Column()
  name: string;

  @AutoMap()
  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ name: 'user_id' })
  userId: string;

  @AutoMap()
  @ManyToOne(() => UserEntity, (user) => user.contacts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @AutoMap()
  @OneToMany(() => TransactionEntity, (transaction) => transaction.contact)
  transactions: TransactionEntity[];
}
