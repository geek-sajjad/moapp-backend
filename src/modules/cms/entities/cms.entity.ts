import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/core/entities';

@Entity('cms')
export class Cms extends BaseEntity {
  @Column({ unique: true })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ unique: true })
  slug: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown>;
}
