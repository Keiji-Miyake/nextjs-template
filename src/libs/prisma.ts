import { Prisma, PrismaClient } from "@prisma/client";
import { readReplicas } from "@prisma/extension-read-replicas";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

//extension for soft delete
const softDelete = Prisma.defineExtension({
  name: "softDelete",
  model: {
    $allModels: {
      async delete<M, A>(
        this: M,
        where: Prisma.Args<M, "delete">["where"],
      ): Promise<Prisma.Result<M, A, "update">> {
        const context = Prisma.getExtensionContext(this);

        return (context as any).update({
          where,
          data: {
            deleted_at: new Date(),
          },
        });
      },
    },
  },
});

//extension for soft delete Many
const softDeleteMany = Prisma.defineExtension({
  name: "softDeleteMany",
  model: {
    $allModels: {
      async deleteMany<M, A>(
        this: M,
        where: Prisma.Args<M, "deleteMany">["where"],
      ): Promise<Prisma.Result<M, A, "updateMany">> {
        const context = Prisma.getExtensionContext(this);

        return (context as any).updateMany({
          where,
          data: {
            deletedAt: new Date(),
          },
        });
      },
    },
  },
});

//extension for filtering soft deleted rows from queries
const filterSoftDeleted = Prisma.defineExtension({
  name: "filterSoftDeleted",
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        if (
          operation === "findUnique" ||
          operation === "findFirst" ||
          operation === "findMany"
        ) {
          console.debug(model);
          args.where = { ...args.where, deletedAt: null };
          return query(args);
        }
        return query(args);
      },
    },
  },
});

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "info", "warn"]
        : ["error"],
  })
    .$extends(
      readReplicas({
        url: process.env.DATABASE_URL_REPLICA || "",
      }),
    )
    .$extends(softDelete) //adding extensions
    .$extends(softDeleteMany)
    .$extends(filterSoftDeleted);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
