import { BaseEntity } from 'src/core/entities';
import { Entity, Column } from 'typeorm';

export enum ContactUsStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  RESPONDED = 'responded',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

@Entity('contact_us')
export class ContactUs extends BaseEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  subject: string;

  @Column('text')
  message: string;

  @Column({
    type: 'enum',
    enum: ContactUsStatus,
    default: ContactUsStatus.PENDING,
  })
  status: ContactUsStatus;

  @Column({ nullable: true })
  response: string;

  @Column({ default: false })
  isResponded: boolean;
}
