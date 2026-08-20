import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const tiposInmueble = [
  { codigo: 'CASA', nombre: 'Casa' },
  { codigo: 'APARTAMENTO', nombre: 'Apartamento' },
  { codigo: 'TERRENO', nombre: 'Terreno' },
  { codigo: 'LOCAL_COMERCIAL', nombre: 'Local comercial' },
];

const estadosInmueble = [
  { codigo: 'DISPONIBLE', nombre: 'Disponible' },
  { codigo: 'RESERVADO', nombre: 'Reservado' },
  { codigo: 'VENDIDO', nombre: 'Vendido' },
];

const usuariosSeed = [
  { nombre: 'Ana Torres', email: 'ana.torres@gestioninmuebles.test', password: 'Password123' },
  { nombre: 'Carlos Ruiz', email: 'carlos.ruiz@gestioninmuebles.test', password: 'Password123' },
  { nombre: 'Maria Gomez', email: 'maria.gomez@gestioninmuebles.test', password: 'Password123' },
];

const direccionesInmuebles = [
  'Av. Libertador 1200',
  'Calle 45 #12-34',
  'Carrera 7 #23-10',
  'Av. Siempre Viva 742',
  'Calle Reforma 88',
  'Av. Insurgentes 500',
  'Calle San Martín 210',
  'Av. 9 de Julio 1000',
  'Calle Corrientes 348',
  'Av. Providencia 1650',
  'Calle Florida 20',
  'Av. Amazonas 210',
  'Calle Real 15',
  'Av. Central 900',
  'Calle del Sol 77',
];

async function main() {
  for (const tipo of tiposInmueble) {
    await prisma.tipoInmueble.upsert({
      where: { codigo: tipo.codigo },
      update: { nombre: tipo.nombre },
      create: tipo,
    });
  }
  console.log(`Seed completado: ${tiposInmueble.length} tipos de inmueble.`);

  for (const estado of estadosInmueble) {
    await prisma.estadoInmueble.upsert({
      where: { codigo: estado.codigo },
      update: { nombre: estado.nombre },
      create: estado,
    });
  }
  console.log(`Seed completado: ${estadosInmueble.length} estados de inmueble.`);

  const usuariosCreados: Awaited<ReturnType<typeof prisma.usuario.upsert>>[] = [];
  for (const u of usuariosSeed) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    const usuario = await prisma.usuario.upsert({
      where: { email: u.email },
      update: {},
      create: { nombre: u.nombre, email: u.email, password: passwordHash },
    });
    usuariosCreados.push(usuario);
  }
  console.log(`Seed completado: ${usuariosCreados.length} usuarios.`);

  const inmueblesExistentes = await prisma.inmueble.count();
  if (inmueblesExistentes > 0) {
    console.log(
      `Ya existen ${inmueblesExistentes} inmuebles, no se vuelven a sembrar.`,
    );
  } else {
    const tiposCreados = await prisma.tipoInmueble.findMany({
      orderBy: { codigo: 'asc' },
    });
    const estadosCreados = await prisma.estadoInmueble.findMany({
      orderBy: { codigo: 'asc' },
    });

    for (let i = 0; i < direccionesInmuebles.length; i++) {
      const vendedor = usuariosCreados[i % usuariosCreados.length];
      const estado = estadosCreados[i % estadosCreados.length];
      const tipo = tiposCreados[i % tiposCreados.length];

      await prisma.inmueble.create({
        data: {
          direccion: direccionesInmuebles[i],
          precio: 50000 + i * 15000,
          habitaciones: (i % 5) + 1,
          metrosCuadrados: 40 + i * 8,
          tipoInmuebleId: tipo.id,
          vendedorId: vendedor.id,
          estadoId: estado.id,
        },
      });
    }
    console.log(`Seed completado: ${direccionesInmuebles.length} inmuebles.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
