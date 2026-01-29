import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/core/entities';
import { AutoMap } from '@automapper/classes';

@Entity('user_admins')
export class UserAdminEntity extends BaseEntity {
  @AutoMap()
  @Column({ unique: true })
  username: string;

  @AutoMap()
  @Column()
  fullName: string;

  @AutoMap()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @AutoMap()
  @Column({ default: true })
  isActive: boolean;

  /**
   * Check if admin is active
   */
  checkIsActive(): boolean {
    return this.isActive;
  }
}
