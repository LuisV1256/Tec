-- CreateTable
CREATE TABLE "estado_inmueble" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "estado_inmueble_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inmuebles" (
    "id" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "precio" DECIMAL(14,2) NOT NULL,
    "habitaciones" INTEGER NOT NULL,
    "metrosCuadrados" DECIMAL(8,2) NOT NULL,
    "tipoInmuebleId" INTEGER NOT NULL,
    "vendedorId" TEXT NOT NULL,
    "estadoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "inmuebles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "estado_inmueble_codigo_key" ON "estado_inmueble"("codigo");

-- AddForeignKey
ALTER TABLE "inmuebles" ADD CONSTRAINT "inmuebles_tipoInmuebleId_fkey" FOREIGN KEY ("tipoInmuebleId") REFERENCES "tipo_inmueble"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inmuebles" ADD CONSTRAINT "inmuebles_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inmuebles" ADD CONSTRAINT "inmuebles_estadoId_fkey" FOREIGN KEY ("estadoId") REFERENCES "estado_inmueble"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
