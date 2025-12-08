import { Injectable } from '@nestjs/common';
import { ContactUsResponseDto } from '../dto/responses/contact-us.response.dto';
import { ContactUs } from '../entities';

@Injectable()
export class ContactUsMapper {
  toContactUsDto(entity: ContactUs): ContactUsResponseDto {
    if (!entity) return null;
    const dto = new ContactUsResponseDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.email = entity.email;
    dto.subject = entity.subject;
    dto.message = entity.message;
    dto.status = entity.status;
    dto.response = entity.response;
    dto.isResponded = entity.isResponded;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }
}
