import { IsEnum } from 'class-validator';
export enum StatusDto { OPEN = 'OPEN', IN_PROGRESS = 'IN_PROGRESS', RESOLVED = 'RESOLVED' }
export class UpdateStatusDto { @IsEnum(StatusDto) status!: StatusDto; }
