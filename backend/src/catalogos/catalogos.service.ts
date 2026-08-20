import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CatalogosService {
  constructor(private readonly prisma: PrismaService) {}

  findTiposInmueble() {
    return this.prisma.db.tipoInmueble.findMany({ where: { activo: true } });
  }
}
