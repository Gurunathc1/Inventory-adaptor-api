// src/save-destination/save-destination.module.ts
import { Module } from '@nestjs/common';
import { InventoryDestinationService } from './invetory-destination.service';
import { InventoryDestinationController } from './invetory-destination.controller';
import { MappingModule } from 'src/mapping/mapping.module';

@Module({
  imports : [MappingModule],
  controllers: [InventoryDestinationController],
  providers: [InventoryDestinationService],
})
export class InventoryDestinationModule {}
