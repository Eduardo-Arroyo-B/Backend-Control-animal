import prisma from "../../../prisma/prismaClient.js";

const getAllBinnacles = async (req, res) => {
    try {
        const binnacles = await prisma.bitacora_Auditoria.findMany({
            orderBy: {
                id: "desc"
            },
            take: 50
        })

        // Convertir fecha a zona México
        const formattedBinnacles = binnacles.map(item => ({
            ...item,
            fecha_hora: item.fecha_hora.toLocaleString("es-MX", {
                timeZone: "America/Mexico_City",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false
            })
        }))

        return res.status(200).json({
            message: binnacles.length === 0
                ? "No hay registros en la bitácora"
                : "Bitácora obtenida exitosamente",
            count: formattedBinnacles.length,
            binnacles: formattedBinnacles
        })

    } catch (error) {
        console.error("Error obteniendo bitácora:", error)

        return res.status(500).json({
            message: "Error interno del servidor al obtener la bitácora"
        })
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

    const rawIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

    const ip = rawIp?.replace('::ffff', '');

    try {
        const createBinnacle = await prisma.bitacora_Auditoria.create({
            data: {
                usuarioId,
                operacion: "CREACION",
                ip,
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