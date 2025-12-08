import { Injectable } from '@nestjs/common';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { ImageDto } from '../dtos/requests/image.dto';
import { ImageResponseDto } from '../dtos/responses';

@Injectable()
export class CommonMappingProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      // Global mappings for shared DTOs
      createMap(mapper, ImageDto, ImageResponseDto);

      // Add other common mappings here as needed
      // createMap(mapper, SomeOtherDto, SomeOtherResponseDto);
    };
  }
}
