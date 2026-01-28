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

  @AutoMap()
  @Column({ type: 'timestamp', nullable: true })
  subscriptionEndDate: Date | null;

  @OneToMany(() => CustomerEntity, (customer) => customer.user)
  customers: CustomerEntity[];

  @OneToMany(() => TransactionEntity, (transaction) => transaction.user)
  transactions: TransactionEntity[];

  /**
   * Check if user's subscription is active
   */
  isSubscriptionActive(): boolean {
    if (!this.subscriptionEndDate) {
      return false;
    }
    return new Date() <= new Date(this.subscriptionEndDate);
  }
}
