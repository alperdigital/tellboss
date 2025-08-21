import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly service: DepartmentsService) {}

  @Get()
  list(@Query('hotel') hotel?: string) {
    return this.service.list(hotel);
  }
}
