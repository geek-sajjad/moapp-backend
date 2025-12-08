import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ResponseUtil } from 'src/core/utilities';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiResponse,
} from '@nestjs/swagger';
import { SinglePageDto } from 'src/core/dtos/responses';
import { ApiResponseWithModel, FileUploadDecorator } from 'src/core/decorators';
import { ImageService } from './image.service';
import {
  UploadImageResponseDto,
  BulkUploadImageResponseDto,
  UploadImageRequestDto,
  BulkUploadImageRequestDto,
} from './dto';
import { ImageSize } from './constant/image.constant';

@ApiTags('image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload/single')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Upload a single image with specific size',
    description:
      'Upload and process a single image file with a specific size variant',
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponseWithModel(UploadImageResponseDto, 'Image uploaded successfully')
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid file type or size',
  })
  @FileUploadDecorator()
  async uploadSingleImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadImageRequestDto,
  ): Promise<SinglePageDto<UploadImageResponseDto>> {
    if (!file) {
      throw new BadRequestException('message.IMAGE.INVALID_FILE_TYPE');
    }

    const result = await this.imageService.uploadSingleImage(
      {
        buffer: file.buffer,
        originalName: file.originalname,
      },
      file.mimetype,
      dto.size || ImageSize.MEDIUM,
    );

    return ResponseUtil.singleData(result);
  }

  @Post('upload/bulk')
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiOperation({
    summary: 'Upload multiple images',
    description:
      'Upload and process multiple image files (max 10) with automatic resizing',
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponseWithModel(
    BulkUploadImageResponseDto,
    'Images uploaded successfully',
  )
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid file type, size, or too many files',
  })
  @FileUploadDecorator()
  async uploadBulkImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: BulkUploadImageRequestDto,
  ): Promise<SinglePageDto<BulkUploadImageResponseDto>> {
    if (!files || files.length === 0) {
      throw new BadRequestException('message.IMAGE.INVALID_FILE_TYPE');
    }

    if (files.length > 10) {
      throw new BadRequestException('Maximum 10 files allowed per upload');
    }

    const results = await this.imageService.uploadBulkImages(
      files,
      dto.size || ImageSize.MEDIUM,
    );

    const successfulUploads = results.filter((result) => result.success);
    const failedUploads = results.filter((result) => !result.success);

    return ResponseUtil.singleData({
      images: successfulUploads.map((result) => result.data),
      totalUploaded: successfulUploads.length,
      failedUploads: failedUploads.length,
    });
  }
}
