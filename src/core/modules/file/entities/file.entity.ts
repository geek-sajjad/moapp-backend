import { BaseEntity } from 'src/core/entities/base.entity';
import { Column, Entity } from 'typeorm';

export enum FileType {
  AVATAR = 'AVATAR',
  GENERAL = 'GENERAL',
}

@Entity('files')
export class FileEntity extends BaseEntity {
  @Column({ nullable: false })
  originalName: string;

  @Column({ nullable: false })
  filePath: string;

  @Column({ nullable: true })
  filePathSmall?: string;

  @Column({ nullable: true })
  filePathMedium?: string;

  @Column({ nullable: true })
  filePathLarge?: string;

  @Column({ nullable: false })
  mimeType: string;

  @Column({ nullable: false, type: 'int' })
  size: number;

  @Column({ nullable: false })
  key: string;

  @Column({ nullable: false })
  extension: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: FileType,
    default: FileType.GENERAL,
  })
  type: FileType;
}
