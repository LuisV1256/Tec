import type { PrismaClient } from '../../generated/prisma/client';

function nombreEnCliente(model: string): string {
  return model.charAt(0).toLowerCase() + model.slice(1);
}

/**
 * Hace invisibles los registros con deletedAt seteado en TODA lectura,
 * y convierte delete/deleteMany en un update que solo marca deletedAt.
 * `rawClient` (sin esta extensión) es el que ejecuta el update de soft-delete,
 * para no volver a disparar el interceptor de `delete`.
 */
export function createSoftDeleteExtension(rawClient: PrismaClient) {
  return {
    name: 'soft-delete',
    query: {
      $allModels: {
        async findUnique({ args, query }: any) {
          args.where = { ...args.where, deletedAt: null };
          return query(args);
        },
        async findUniqueOrThrow({ args, query }: any) {
          args.where = { ...args.where, deletedAt: null };
          return query(args);
        },
        async findFirst({ args, query }: any) {
          args.where = { ...args.where, deletedAt: null };
          return query(args);
        },
        async findFirstOrThrow({ args, query }: any) {
          args.where = { ...args.where, deletedAt: null };
          return query(args);
        },
        async findMany({ args, query }: any) {
          args.where = { ...args.where, deletedAt: null };
          return query(args);
        },
        async count({ args, query }: any) {
          args.where = { ...args.where, deletedAt: null };
          return query(args);
        },
        async aggregate({ args, query }: any) {
          args.where = { ...args.where, deletedAt: null };
          return query(args);
        },
        async delete({ model, args }: any) {
          return (rawClient as any)[nombreEnCliente(model)].update({
            where: args.where,
            data: { deletedAt: new Date() },
          });
        },
        async deleteMany({ model, args }: any) {
          return (rawClient as any)[nombreEnCliente(model)].updateMany({
            where: args.where,
            data: { deletedAt: new Date() },
          });
        },
      },
    },
  };
}
