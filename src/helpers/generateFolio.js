import prisma from "../../prisma/prismaClient.js";

const generateFolio = async (tipo) => {
    const anio = new Date().getFullYear();

    // Busca el registro del año y tipo
    let folioRecord = await prisma.folio_Seguimiento.findUnique({
        where: {
            tipo_anio: { tipo, anio }
        }
    });

    if (!folioRecord) {
        // Si no existe, creamos uno nuevo
        folioRecord = await prisma.folio_Seguimiento.create({
            data: { tipo, anio, ultimo: 1 }
        });
    } else {
        // Incrementamos el último número de forma segura
        folioRecord = await prisma.folio_Seguimiento.update({
            where: { id: folioRecord.id },
            data: { ultimo: { increment: 1 } }
        });
    }

    // Retornamos el folio completo
    return `${tipo}-${anio}-${folioRecord.ultimo.toString().padStart(5, "0")}`;
};

export default generateFolio;
