import { IsUUID } from 'class-validator';

export class UUIDParam {
  @IsUUID()
  userId: string;
}
