import { Test, TestingModule } from '@nestjs/testing';
import { InventoryDestinationController} from './invetory-destination.controller'

describe('InventoryDestinationController', () => {
  let controller: InventoryDestinationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryDestinationController],
    }).compile();

    controller = module.get<InventoryDestinationController>(InventoryDestinationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
