import { Controller, Get } from '@nestjs/common';
import { CatalogosService } from './catalogos.service';

@Controller()
export class CatalogosController {
  constructor(private readonly catalogosService: CatalogosService) {}

  @Get('tipos-inmueble')
  findTiposInmueble() {
    return this.catalogosService.findTiposInmueble();
  }
}
