import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { sanitizarUsuario } from '../common/sanitizar-usuario';
import { construirRespuestaPaginada } from '../common/paginar';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { QueryUsuariosDto } from './dto/query-usuarios.dto';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryUsuariosDto) {
    const skip = (query.page - 1) * query.limit;

    const [usuarios, total] = await Promise.all([
      this.prisma.db.usuario.findMany({ skip, take: query.limit }),
      this.prisma.db.usuario.count(),
    ]);

    return construirRespuestaPaginada(
      usuarios.map(sanitizarUsuario),
      total,
      query.page,
      query.limit,
    );
  }

  async findOne(id: string) {
    const usuario = await this.prisma.db.usuario.findUnique({ where: { id } });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado.');
    }
    return sanitizarUsuario(usuario);
  }

  async update(id: string, dto: UpdateUsuarioDto, usuarioAutenticadoId: string) {
    await this.validarPropietario(id, usuarioAutenticadoId);

    if (dto.email) {
      const existente = await this.prisma.db.usuario.findUnique({
        where: { email: dto.email },
      });
      if (existente && existente.id !== id) {
        throw new ConflictException('El email ya está registrado.');
      }
    }

    const usuario = await this.prisma.db.usuario.update({
      where: { id },
      data: dto,
    });
    return sanitizarUsuario(usuario);
  }

  async remove(id: string, usuarioAutenticadoId: string) {
    await this.validarPropietario(id, usuarioAutenticadoId);
    const usuario = await this.prisma.db.usuario.delete({ where: { id } });
    return sanitizarUsuario(usuario);
  }

  /**
   * Si el usuario no existe O no es la propia cuenta, responde 404 en ambos
   * casos (IDOR): no confirmamos la existencia de cuentas ajenas.
   */
  private async validarPropietario(id: string, usuarioAutenticadoId: string) {
    if (id !== usuarioAutenticadoId) {
      throw new NotFoundException('Usuario no encontrado.');
    }
    const usuario = await this.prisma.db.usuario.findUnique({ where: { id } });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado.');
    }
    return usuario;
  }
}
