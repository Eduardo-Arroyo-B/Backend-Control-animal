import prisma from "../../prisma/prismaClient.js"

// Funcion para crear un registro en la bitacora
export default async function binnacle({usuarioId, fecha_hora, operacion, ip, resultado}) {
    try {
        const log = await prisma.bitacora_Auditoria.create({
            data: {
                usuarioId,
                fecha_hora,
                operacion,
                ip,
                resultado
            }
        })

        return log
    } catch (error) {
        console.error("Error al crear bitacora:", error)
        return null
    }
}