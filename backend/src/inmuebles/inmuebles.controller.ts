import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { InmueblesService } from './inmuebles.service';
import { CreateInmuebleDto } from './dto/create-inmueble.dto';
import { UpdateInmuebleDto } from './dto/update-inmueble.dto';
import { CambiarEstadoDto } from './dto/cambiar-estado.dto';

@UseGuards(JwtAuthGuard)
@Controller('inmuebles')
export class InmueblesController {
  constructor(private readonly inmueblesService: InmueblesService) {}

  @Post()
  create(@Body() dto: CreateInmuebleDto, @CurrentUser() user: { id: string }) {
    return this.inmueblesService.create(dto, user.id);
  }

  @Get()
  findAll() {
    return this.inmueblesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inmueblesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateInmuebleDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.inmueblesService.update(id, dto, user.id);
  }

  @Patch(':id/estado')
  cambiarEstado(
    @Param('id') id: string,
    @Body() dto: CambiarEstadoDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.inmueblesService.cambiarEstado(id, dto.estadoCodigo, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.inmueblesService.remove(id, user.id);
  }
}
