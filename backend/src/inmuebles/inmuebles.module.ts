import { Module } from '@nestjs/common';
import { InmueblesController } from './inmuebles.controller';
import { InmueblesService } from './inmuebles.service';

@Module({
  controllers: [InmueblesController],
  providers: [InmueblesService],
})
export class InmueblesModule {}
