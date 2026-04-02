import { Module } from '@nestjs/common';
import { MappingService } from './mapping.service';

@Module({
  providers: [MappingService],
  exports: [MappingService], // Export so other modules (InventoryDestinationModule) can use it
})
export class MappingModule {}
