import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from '@poster-parlor-api/logger';
import { AppConfigModule } from '@poster-parlor-api/config';
import { DatabaseModule } from '@poster-parlor-api/database';
import { AuthModule } from '@poster-parlor-api/auth';
import { InventoryModule } from '@poster-parlor-api/inventory';
import { ReviewModule } from '@poster-parlor-api/review';
import { OrderModule } from '@poster-parlor-api/orders';
import { AdminModule } from '@poster-parlor-api/admin';
@Module({
  imports: [
    LoggerModule,
    AppConfigModule,
    DatabaseModule,
    AuthModule,
    InventoryModule,
    ReviewModule,
    OrderModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
