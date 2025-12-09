import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/core/entities';
import { AutoMap } from '@automapper/classes';
import { RoleEnum } from 'src/core/enums';
import { ContactEntity } from 'src/modules/contact/entities';

@Entity('users')
export class UserEntity extends BaseEntity {
  @AutoMap()
  @Column({ unique: true })
  username: string;

  @AutoMap()
  @Column({ unique: true, nullable: true })
  email?: string;

  @AutoMap()
  @Column({ unique: true })
  phoneNumber: string;

  @AutoMap()
  @Column()
  fullName: string;

  @Column()
  password: string;

  @AutoMap()
  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.USER,
  })
  role: RoleEnum;

  @AutoMap()
  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  firebaseToken?: string;

  @AutoMap()
  @OneToMany(() => ContactEntity, (contact) => contact.user)
  contacts: ContactEntity[];
}
