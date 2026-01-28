import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/core/entities';
import { AutoMap } from '@automapper/classes';
import { CustomerEntity } from 'src/modules/customer/entities';
import { TransactionEntity } from 'src/modules/transaction/entities';

@Entity('users')
export class UserEntity extends BaseEntity {
  @AutoMap()
  @Column({ unique: true })
  username: string;

  @AutoMap()
  @Column()
  fullName: string;

  @AutoMap()
  @Column({ unique: true })
  phoneNumber: string;

  @Column()
  password: string;

  @OneToMany(() => CustomerEntity, (customer) => customer.user)
  customers: CustomerEntity[];

  @OneToMany(() => TransactionEntity, (transaction) => transaction.user)
  transactions: TransactionEntity[];
}
