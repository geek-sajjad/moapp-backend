import { Injectable } from '@nestjs/common';
import { CmsPageResponseDto } from '../dto/responses/cms-page.response.dto';
import { Cms } from '../entities';

@Injectable()
export class CmsMapper {
  toCmsPageDto(entity: Cms): CmsPageResponseDto {
    if (!entity) return null;
    const dto = new CmsPageResponseDto();
    dto.id = entity.id;
    dto.title = entity.title;
    dto.content = entity.content;
    dto.slug = entity.slug;
    dto.isActive = entity.isActive;
    dto.metadata = entity.metadata;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }
}
