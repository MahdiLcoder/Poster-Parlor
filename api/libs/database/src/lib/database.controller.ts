import { Controller, Get } from '@nestjs/common';
import { DatabaseHealthService } from './database.service';
import { Public } from '@poster-parlor-api/auth';
@Controller('db-health')
export class DatabaseController {
  constructor(private readonly databaseHealthService: DatabaseHealthService) {}

  @Get()
  @Public()
  async healthCheck() {
    const res = await this.databaseHealthService.checkHealth();
    return res;
  }
}
