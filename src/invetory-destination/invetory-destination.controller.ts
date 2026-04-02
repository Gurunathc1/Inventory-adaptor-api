import { Controller, Post, Body, Get, Query, Param, UseGuards } from '@nestjs/common';
import { InventoryDestinationService } from './invetory-destination.service';
import { InventoryDestinationDto } from './dto/inventory-destination.dto';
import { JwtAuthGuard } from 'common/gaurds/jwt-auth.guard';
import { RolesGuard } from 'common/gaurds/roles.gaurds';
import { RolesDecorators } from 'src/auth/roles.decorator';
import { Roles } from 'common/roles.enums';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('inventory-destination')
export class InventoryDestinationController {
  constructor(private readonly service: InventoryDestinationService) {}

  @RolesDecorators(Roles.UPLOADER)
  @Post('save')
  async saveData(@Body() dto: InventoryDestinationDto) {
    return this.service.saveData(dto);
  }


  @Get('history')
  async getHistory(
    @Query('url') url: string,
    @Query('limit') limit = '10'
  ) {
    const limitNum = parseInt(limit, 10);
    return this.service.getHistory(url, isNaN(limitNum) ? 10 : limitNum);
  }

  @Get('data/:uploadRunId')
  async getData(
    @Query('url') url: string,
    @Query('inventoryCollection') inventoryCollection: string,
    @Param('uploadRunId') uploadRunId: string
  ) {
    return this.service.getData(url, inventoryCollection, uploadRunId);
  }


  @Get('mapping/:sheetName')
  async getMapping(
    @Query('url') url: string,
    @Query('mappingCollection') mappingCollection: string,
    @Param('sheetName') sheetName: string
  ) {
    return this.service.getMapping(url, mappingCollection, sheetName);
  }
}
