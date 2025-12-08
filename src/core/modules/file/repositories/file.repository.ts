import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from 'src/core/repositories/base.repository';
import { FileEntity, FileType } from '../entities';

@Injectable()
export class FileRepository extends BaseRepository<FileEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, FileEntity);
  }

  async findById(id: string): Promise<FileEntity | null> {
    return this.findOne({ where: { id } });
  }

  async createFile(metadata: Partial<FileEntity>): Promise<FileEntity> {
    const file = this.create(metadata);
    return this.save(file);
  }

  async findFileById(fileId: string): Promise<FileEntity | null> {
    return this.findOne({ where: { id: fileId } });
  }

  async findFilesByType(type: FileType): Promise<FileEntity[]> {
    return this.find({ where: { type } });
  }

  async deleteFile(fileId: string): Promise<void> {
    const file = await this.findOne({ where: { id: fileId } });
    if (file) {
      // file.deletedAt = new Date();
      // await this.save(file);
    }
  }
}
