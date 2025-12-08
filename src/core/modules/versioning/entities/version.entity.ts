import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('version')
export class VersionEntity {
  @PrimaryGeneratedColumn()
  id: number; // Auto-generated primary key for the entity

  @Column({ type: 'varchar', length: 10, default: '1.0.0' })
  version: string; // Semantic version (e.g., 1.0.0)

  @Column({ type: 'date' })
  releaseDate: Date; // Release date

  @Column({ type: 'boolean', default: false })
  forceUpdate: boolean; // Force update flag

  @Column({
    name: 'createdAt',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  createdAt?: Date; // Auto-generated creation`timestamp

  @Column({
    name: 'updatedAt',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  updatedAt?: Date; // Auto-generated updated timestamp that updates on every change
}
