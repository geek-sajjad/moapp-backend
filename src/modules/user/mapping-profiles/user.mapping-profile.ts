import { Injectable } from '@nestjs/common';
import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { UserEntity, UserAdminEntity } from '../entities';
import { UserResponseDto, AdminResponseDto } from '../dto/responses';

@Injectable()
export class UserMappingProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      // User entity to UserResponseDto
      createMap(
        mapper,
        UserEntity,
        UserResponseDto,
        forMember(
          (destination) => destination.isSubscriptionActive,
          mapFrom((source) => source.isSubscriptionActive()),
        ),
      );

      // UserAdmin entity to AdminResponseDto
      createMap(mapper, UserAdminEntity, AdminResponseDto);
    };
  }
}
