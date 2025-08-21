import { Optional } from '@nestjs/common';
import { IsOptional, IsString } from 'class-validator';
export class CreateComplaintDto {
  @IsString() title!: string;
  @IsString() description!: string;
  @IsString() departmentId!: string; 
   // misafir akışı için
  @IsString() @IsOptional()
  hotelCode?: string;
}
