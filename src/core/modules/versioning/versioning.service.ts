import { Injectable } from '@nestjs/common';
import { VersioningRepository } from './repositories';
import { VersionResponseDto } from './dtos/responses';
import { AddVersionDto } from './dtos/requests';
import { VersionEntity } from './entities';

@Injectable()
export class VersioningService {
  constructor(private versionRepository: VersioningRepository) {}

  async save(params: AddVersionDto): Promise<VersionResponseDto> {
    const versionData = new VersionEntity();
    versionData.version = params.version;

    versionData.releaseDate = params.releaseDate
      ? new Date(params.releaseDate)
      : new Date();

    versionData.forceUpdate = params.forceUpdate;
    const savedVersion = await this.versionRepository.save(versionData);

    return new VersionResponseDto(savedVersion);
  }

  async getLatest(): Promise<VersionResponseDto> {
    const latestVersion = await this.versionRepository.getLatest();

    if (!latestVersion) {
      throw new Error('message.VERSION.NOT_FOUND');
    }

    return new VersionResponseDto(latestVersion);
  }

  async findAll(): Promise<VersionResponseDto[]> {
    const result = (await this.versionRepository.findAll()).map(
      (item) => new VersionResponseDto(item),
    );
    return result;
  }
}
