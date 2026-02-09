import prisma from "../../../prisma/prismaClient.js";

const getAllBinnacles = async (req, res) => {
    try {
        const binnacles = await prisma.bitacora_Auditoria.findMany({
            orderBy: {
                id: "desc"
            },
            take: 50
        })

        if (binnacles.length === 0) {
            return res.status(404).json({ message: "No se encontraron resultados en la bitacora de auditoria" })
        }

        return res.status(200).json({ message: "Bitacora encontrada exitosamente", binnacles })
    } catch (error) {
        return res.status(400).json({ message: "No se pudieron obtener "})
    }
}

const createDeleteBinnacle = async (req, res) => {
    // Extraccion de datos del body
    const {
        usuarioId,
        operacion,
        resultado
    } = req.body

    const rawIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

    const ip = rawIp?.replace('::ffff', '');

    try {
        const deleteBinaccle = await prisma.bitacora_Auditoria.create({
            data: {
                usuarioId,
                fecha_hora: new Date().toISOString(),
                operacion,
                ip,
                resultado
            }
        })

        if (!deleteBinaccle) {
            return res.status(404).json({ message: "No se pudo crear la bitacora de cierre de sesion" })
        }

        return res.status(201).json({ message: "Bitacora de eliminacion creada exitosamente", deleteBinaccle })
    } catch (error) {
        return res.status(404).json({ message: "Error la crear la bitacora de eliminacion", error: error.message })
    }
}

const createBinnacleReports = async (req, res) => {
    const { resultado, usuarioId } = req.body

    try {
        const createBinnacle = await prisma.bitacora_Auditoria.create({
            data: {
                usuarioId,
                fecha_hora: new Date().toISOString(),
                operacion: "CREACION",
                ip: rawIp?.replace('::ffff', ''),
                resultado: `Reporte de ${resultado} creado con ID ${usuarioId}`
            }
        })

        if (!createBinnacle) {
            return res.status(404).json({ message: "No se pudo crear la bitacora de reportes" })
        }

        return res.status(201).json({ message: "Bitacora de reportes creada exitosamente" })
    } catch (error) {
        return res.status(500).json({ message: "Error la crear la bitacora de reportes" })
    }
}

export {
    getAllBinnacles,
    createDeleteBinnacle,
    createBinnacleReports
}