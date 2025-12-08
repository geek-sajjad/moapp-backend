import { DataSource } from 'typeorm';
import { BaseRepository } from '../../../core/repositories/base.repository';
import { ContactUs } from '../entities';

export class ContactUsRepository extends BaseRepository<ContactUs> {
  constructor(dataSource: DataSource) {
    super(dataSource, ContactUs);
  }
}
