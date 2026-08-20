import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInmuebleDto } from './dto/create-inmueble.dto';
import { UpdateInmuebleDto } from './dto/update-inmueble.dto';
import {
  ESTADO_FINAL,
  ESTADO_INICIAL,
  InmuebleErrorCode,
  TRANSICIONES_VALIDAS,
} from './estados-inmueble.constants';

const INCLUDE_RELACIONES = { estado: true, tipoInmueble: true } as const;

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

  findAll() {
    return this.prisma.db.inmueble.findMany({ include: INCLUDE_RELACIONES });
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
        errorCode: InmuebleErrorCode.ESTADO_FINAL,
        message: `Un inmueble en estado ${ESTADO_FINAL} no se puede editar.`,
      });
    }

    return this.prisma.db.inmueble.update({
      where: { id },
      data: dto,
      include: INCLUDE_RELACIONES,
    });
  }

  async cambiarEstado(id: string, estadoCodigoDestino: string, usuarioId: string) {
    const inmueble = await this.obtenerYValidarPropietario(id, usuarioId);

    const estadoActual = inmueble.estado.codigo;
    const permitidas = TRANSICIONES_VALIDAS[estadoActual] ?? [];

    if (!permitidas.includes(estadoCodigoDestino)) {
      throw new ConflictException({
        errorCode: InmuebleErrorCode.TRANSICION_INVALIDA,
        message: `No se puede pasar de ${estadoActual} a ${estadoCodigoDestino}.`,
      });
    }

    const estadoDestino = await this.prisma.db.estadoInmueble.findUnique({
      where: { codigo: estadoCodigoDestino },
    });
    if (!estadoDestino) {
      throw new NotFoundException(
        `El estado "${estadoCodigoDestino}" no está sembrado en la base de datos.`,
      );
    }

    return this.prisma.db.inmueble.update({
      where: { id },
      data: { estadoId: estadoDestino.id },
      include: INCLUDE_RELACIONES,
    });
  }

  async remove(id: string, usuarioId: string) {
    await this.obtenerYValidarPropietario(id, usuarioId);
    return this.prisma.db.inmueble.delete({ where: { id } });
  }

  private async obtenerYValidarPropietario(id: string, usuarioId: string) {
    const inmueble = await this.prisma.db.inmueble.findUnique({
      where: { id },
      include: INCLUDE_RELACIONES,
    });
    if (!inmueble) {
      throw new NotFoundException('Inmueble no encontrado.');
    }
    if (inmueble.vendedorId !== usuarioId) {
      throw new ForbiddenException(
        'Solo el vendedor dueño del inmueble puede modificarlo o eliminarlo.',
      );
    }
    return inmueble;
  }
}
