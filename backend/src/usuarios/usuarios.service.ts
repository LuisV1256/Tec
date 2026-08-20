import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { sanitizarUsuario } from '../common/sanitizar-usuario';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const usuarios = await this.prisma.db.usuario.findMany();
    return usuarios.map(sanitizarUsuario);
  }

  async findOne(id: string) {
    const usuario = await this.prisma.db.usuario.findUnique({ where: { id } });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado.');
    }
    return sanitizarUsuario(usuario);
  }

  async update(id: string, dto: UpdateUsuarioDto, usuarioAutenticadoId: string) {
    if (id !== usuarioAutenticadoId) {
      throw new ForbiddenException('Solo puedes editar tu propia cuenta.');
    }

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

  async desactivar(id: string, usuarioAutenticadoId: string) {
    if (id !== usuarioAutenticadoId) {
      throw new ForbiddenException('Solo puedes desactivar tu propia cuenta.');
    }

    const usuario = await this.prisma.db.usuario.update({
      where: { id },
      data: { activo: false },
    });
    return sanitizarUsuario(usuario);
  }
}
