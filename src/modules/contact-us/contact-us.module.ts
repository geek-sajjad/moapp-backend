import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ContactUsService } from './services/contact-us.service';
import { ContactUs } from './entities/contact-us.entity';
import { ContactUsRepository } from './repositories/contact-us.repository';
import { createRepository } from '../../core/repositories/repository.factory';
import { ContactUsPublicController, ContactUsController } from './controllers';
import { ContactUsMapper } from './mappers';

@Module({
  imports: [TypeOrmModule.forFeature([ContactUs])],
  controllers: [ContactUsPublicController, ContactUsController],
  providers: [
    ContactUsService,
    ContactUsMapper,
    {
      provide: ContactUsRepository,
      useFactory: (dataSource: DataSource) =>
        createRepository<ContactUs, ContactUsRepository>(
          dataSource,
          ContactUsRepository,
        ),
      inject: [DataSource],
    },
  ],
  exports: [ContactUsService],
})
export class ContactUsModule {}
