import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { AddAttachmentDto } from './dto/add-attachment.dto';
import { AuthGuard } from '@nestjs/passport';
import { Status } from '@prisma/client';
import { ApiBearerAuth } from '@nestjs/swagger';


@ApiBearerAuth('bearer')
@UseGuards(AuthGuard('jwt'))
@Controller('complaints')
export class ComplaintsController {
  constructor(private readonly service: ComplaintsService) {}

  @Post()
  create(@Body() dto: CreateComplaintDto, @Req() req: any) {
    const userId = req.user?.userId;
    return this.service.create(dto, userId);
  }

  @Get()
  list() {
    return this.service.list();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.service.updateStatus(id, dto.status as unknown as Status);
  }

  @Post(':id/attachments')
  addAttachment(@Param('id') id: string, @Body() dto: AddAttachmentDto) {
    return this.service.addAttachment(id, dto.url, dto.type);
  }
}
