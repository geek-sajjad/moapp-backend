import { IsOptional, IsObject } from 'class-validator';

export class FilterDto<T> {
  @IsOptional()
  @IsObject()
  readonly filters?: T; // Dynamic filters, typed via generic T
}
