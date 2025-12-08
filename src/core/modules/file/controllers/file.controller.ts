/* eslint-disable import/no-extraneous-dependencies */
import {
  Controller,
  Post,
  UploadedFile,
  Param,
  Delete,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';
import * as multer from 'multer';
import { ApiResponseWithModel } from 'src/core/decorators';
import { ResponseUtil } from 'src/core/utilities';
import { ValidateObjectIdPipe } from 'src/core/pipes';
import { ResponseDto } from 'src/core/dtos/responses';
import {
  FileValidationInterceptor,
  ImageValidationInterceptor,
} from '../interceptors';
import {
  DeleteFileResponseDto,
  UploadFileResponseDto,
} from '../dtos/responses';
import { FileService } from '../services';

@ApiTags('Files')
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
    FileValidationInterceptor,
  )
  @ApiResponseWithModel(
    UploadFileResponseDto,
    'File uploaded successfully',
    201,
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      const savedFile = await this.fileService.uploadFileS3(file);
      return ResponseUtil.singleData(
        new UploadFileResponseDto({
          filePath: savedFile.filePath,
          originalName: savedFile.originalName,
          filePathLarge: savedFile.filePathLarge,
          filePathSmall: savedFile.filePathSmall,
          filePathMedium: savedFile.filePathMedium,
          id: savedFile.id,
          extension: savedFile.extension,
          mimeType: savedFile.mimeType,
        }),
      );
    } catch (err) {
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        throw new BadRequestException('File size exceeds the 1MB limit');
      }
      throw err;
    }
  }

  @Post('upload-image')
  @ApiOperation({ summary: 'Upload an image (3 sizes)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
    ImageValidationInterceptor,
  )
  @ApiResponseWithModel(
    UploadFileResponseDto,
    'Image uploaded successfully',
    201,
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    try {
      const savedFile = await this.fileService.uploadAndResizeImageS3(file);
      return ResponseUtil.singleData(
        new UploadFileResponseDto({
          filePath: savedFile.filePath,
          originalName: savedFile.originalName,
          filePathLarge: savedFile.filePathLarge,
          filePathSmall: savedFile.filePathSmall,
          filePathMedium: savedFile.filePathMedium,
          id: savedFile.id,
          extension: savedFile.extension,
          mimeType: savedFile.mimeType,
        }),
      );
    } catch (err) {
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        throw new BadRequestException('Image size exceeds the 1MB limit');
      }
      throw err;
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a file by ID' })
  @ApiResponseWithModel(DeleteFileResponseDto, 'File deleted successfully', 200)
  async deleteFile(
    @Param('id', ValidateObjectIdPipe) id: string,
  ): Promise<ResponseDto<DeleteFileResponseDto>> {
    await this.fileService.deleteFile(id);
    return ResponseUtil.success<DeleteFileResponseDto>('file.delete.success', {
      message: 'File deleted successfully',
    });
  }
}
