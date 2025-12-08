import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ContactUsResponseDto } from '../dto/responses/contact-us.response.dto';
import { CreateContactUsDto } from '../dto/requests/create-contact-us.dto';
import { ContactUsService } from '../services/contact-us.service';

@ApiTags('Contact Us - Public')
@Controller('contact-us/public')
export class ContactUsPublicController {
  constructor(private readonly contactUsService: ContactUsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new contact message' })
  @ApiResponse({
    status: 201,
    description: 'Contact message created successfully',
    type: ContactUsResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(
    @Body() createContactDto: CreateContactUsDto,
  ): Promise<ContactUsResponseDto> {
    return this.contactUsService.create(createContactDto);
  }
}
