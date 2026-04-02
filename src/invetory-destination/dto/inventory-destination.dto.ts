// inventory-destination.dto.ts
import { IsString, IsOptional, IsArray } from 'class-validator';

export class InventoryDestinationDto {
  @IsString()
  url: string;

  @IsString()
  inventoryCollection: string;

  @IsString()
  mappingCollection: string;

  @IsOptional()
  @IsArray()
  data?: any[];

  @IsOptional()
  mapping?: any;
}
