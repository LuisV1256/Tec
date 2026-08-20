import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
