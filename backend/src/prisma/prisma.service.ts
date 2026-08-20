import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';
import { createSoftDeleteExtension } from './soft-delete.extension';

function crearCliente() {
  const rawClient = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });
  const db = rawClient.$extends(createSoftDeleteExtension(rawClient));
  return { rawClient, db };
}

export type Db = ReturnType<typeof crearCliente>['db'];

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly rawClient: PrismaClient;

  /** Cliente con borrado lógico aplicado. Úsalo en todos los servicios de negocio. */
  readonly db: Db;

  constructor() {
    const { rawClient, db } = crearCliente();
    this.rawClient = rawClient;
    this.db = db;
  }

  async onModuleInit() {
    await this.rawClient.$connect();
  }

  async onModuleDestroy() {
    await this.rawClient.$disconnect();
  }
}
