import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { InventoryDestinationModule } from './invetory-destination/invetory-destination.module';
import { MappingModule } from './mapping/mapping.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/inventoryDB'),UserModule, AuthModule, InventoryDestinationModule, MappingModule],
  controllers: [AppController ],
  providers: [AppService],
})
export class AppModule {}
