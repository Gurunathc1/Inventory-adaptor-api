import { Test, TestingModule } from '@nestjs/testing';
import { InventoryDestinationService } from './invetory-destination.service';

describe('InvetoryDestinationService', () => {
  let service: InventoryDestinationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventoryDestinationService],
    }).compile();

    service = module.get<InventoryDestinationService>(InventoryDestinationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
