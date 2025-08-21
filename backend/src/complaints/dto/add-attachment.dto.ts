import { IsString, IsUrl } from 'class-validator';
export class AddAttachmentDto {
  @IsUrl() url!: string;           // v1.0: sadece URL
  @IsString() type!: string;       // 'image/jpeg', 'audio/mpeg' vb.
}
