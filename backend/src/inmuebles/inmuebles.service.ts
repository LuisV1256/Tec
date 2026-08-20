import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { construirRespuestaPaginada } from '../common/paginar';
import { CreateInmuebleDto } from './dto/create-inmueble.dto';
import { UpdateInmuebleDto } from './dto/update-inmueble.dto';
import { QueryInmueblesDto } from './dto/query-inmuebles.dto';
import {
  ESTADO_FINAL,
  ESTADO_INICIAL,
  InmuebleErrorCode,
  TRANSICIONES_VALIDAS,
} from './estados-inmueble.constants';

const INCLUDE_RELACIONES = {
  estado: true,
  tipoInmueble: true,
  vendedor: {
    select: {
      id: true,
      nombre: true,
      email: true,
      activo: true,
      createdAt: true,
      updatedAt: true,
    },
  },
} satisfies Prisma.InmuebleInclude;

@Injectable()
export class InmueblesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateInmuebleDto, vendedorId: string) {
    const estadoInicial = await this.prisma.db.estadoInmueble.findUnique({
      where: { codigo: ESTADO_INICIAL },
    });
    if (!estadoInicial) {
      throw new NotFoundException(
        `El estado inicial "${ESTADO_INICIAL}" no está sembrado en la base de datos.`,
      );
    }

    return this.prisma.db.inmueble.create({
      data: {
        direccion: dto.direccion,
        precio: dto.precio,
        habitaciones: dto.habitaciones,
        metrosCuadrados: dto.metrosCuadrados,
        tipoInmuebleId: dto.tipoInmuebleId,
        vendedorId,
        estadoId: estadoInicial.id,
      },
      include: INCLUDE_RELACIONES,
    });
  }

  async findAll(query: QueryInmueblesDto, usuarioId: string) {
    const where: Prisma.InmuebleWhereInput = {
      ...(query.estado && { estado: { codigo: query.estado } }),
      ...(query.tipoInmuebleId && { tipoInmuebleId: query.tipoInmuebleId }),
      ...(query.search && {
        direccion: { contains: query.search, mode: 'insensitive' },
      }),
      ...(query.soloMios && { vendedorId: usuarioId }),
      ...((query.precioMin !== undefined || query.precioMax !== undefined) && {
        precio: {
          ...(query.precioMin !== undefined && { gte: query.precioMin }),
          ...(query.precioMax !== undefined && { lte: query.precioMax }),
        },
      }),
    };

    const skip = (query.page - 1) * query.limit;

    const [data, total] = await Promise.all([
      this.prisma.db.inmueble.findMany({
        where,
        include: INCLUDE_RELACIONES,
        orderBy: { [query.orderBy]: query.order.toLowerCase() as 'asc' | 'desc' },
        skip,
        take: query.limit,
      }),
      this.prisma.db.inmueble.count({ where }),
    ]);

    return construirRespuestaPaginada(data, total, query.page, query.limit);
  }

  async findOne(id: string) {
    const inmueble = await this.prisma.db.inmueble.findUnique({
      where: { id },
      include: INCLUDE_RELACIONES,
    });
    if (!inmueble) {
      throw new NotFoundException('Inmueble no encontrado.');
    }
    return inmueble;
  }

  async update(id: string, dto: UpdateInmuebleDto, usuarioId: string) {
    const inmueble = await this.obtenerYValidarPropietario(id, usuarioId);

    if (inmueble.estado.codigo === ESTADO_FINAL) {
      throw new ConflictException({
        code: InmuebleErrorCode.ESTADO_FINAL,
        message: `Un inmueble en estado ${ESTADO_FINAL} no se puede editar.`,
      });
    }

    return this.prisma.db.inmueble.update({
      where: { id },
      data: dto,
      include: INCLUDE_RELACIONES,
    });
  }

  async cambiarEstado(id: string, estadoDestino: string, usuarioId: string) {
    const inmueble = await this.obtenerYValidarPropietario(id, usuarioId);

    const estadoActual = inmueble.estado.codigo;
    const permitidas = TRANSICIONES_VALIDAS[estadoActual] ?? [];

    if (!permitidas.includes(estadoDestino)) {
      throw new ConflictException({
        code: InmuebleErrorCode.TRANSICION_INVALIDA,
        message: `No se puede pasar de ${estadoActual} a ${estadoDestino}.`,
      });
    }

    const estado = await this.prisma.db.estadoInmueble.findUnique({
      where: { codigo: estadoDestino },
    });
    if (!estado) {
      throw new NotFoundException(
        `El estado "${estadoDestino}" no está sembrado en la base de datos.`,
      );
    }

    return this.prisma.db.inmueble.update({
      where: { id },
      data: { estadoId: estado.id },
      include: INCLUDE_RELACIONES,
    });
  }

  async remove(id: string, usuarioId: string) {
    await this.obtenerYValidarPropietario(id, usuarioId);
    return this.prisma.db.inmueble.delete({ where: { id } });
  }

  /**
   * Si el inmueble no existe O no es del usuario autenticado, responde 404
   * en ambos casos (IDOR): no confirmamos la existencia de recursos ajenos.
   */
  private async obtenerYValidarPropietario(id: string, usuarioId: string) {
    const inmueble = await this.prisma.db.inmueble.findUnique({
      where: { id },
      include: INCLUDE_RELACIONES,
    });
    if (!inmueble || inmueble.vendedorId !== usuarioId) {
      throw new NotFoundException('Inmueble no encontrado.');
    }
    return inmueble;
  }
}
