import { BaseEntity } from 'src/core/entities';
import { Entity, Column } from 'typeorm';

@Entity('faqs')
export class Faq extends BaseEntity {
  @Column({ unique: true })
  question: string;

  @Column('text')
  answer: string;

  @Column({ default: 0 })
  order: number;

  @Column({ default: true })
  isActive: boolean;
}
