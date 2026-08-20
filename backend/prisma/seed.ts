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

async function main() {
  for (const tipo of tiposInmueble) {
    await prisma.tipoInmueble.upsert({
      where: { codigo: tipo.codigo },
      update: { nombre: tipo.nombre },
      create: tipo,
    });
  }
  console.log(`Seed completado: ${tiposInmueble.length} tipos de inmueble.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
