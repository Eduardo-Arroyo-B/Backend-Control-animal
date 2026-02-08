import prisma from "../../../prisma/prismaClient.js";
import generateFolio from "../../helpers/generateFolio.js";
import bitacora from "../../helpers/binnacle.js";

const getDewormings = async (req, res) => {
    try {
        const deworming = await prisma.desparasitaciones.findMany({
            include: {
                Animal: true,
                Usuarios: true
            },
            take: 10
        })

        if (deworming > 0) {
            return res.status(400).json({ message: "No hay desparacitaciones actualmente" })
        }

        return res.status(200).json({ message: "Desparasitaciones obtenidas exitosamente", deworming})
    } catch (error) {
        res.status(500).json({ message: "Ha ocurrido un error al obtener la desparasitacion", error: error.message})
    }
}

const getDewormingByID = async (req, res) => {}

const createDeworming = async (req, res) => {
    // Obtener datos del body
    const {
        folio_desparasitacion,
        animal_id,
        producto_utilizado,
        aplicado_por,
        costo_desparasitacion
    } = req.body;

    const folioDes = await generateFolio("DPS");

    // Objeto desparasitacion
    const dewormingData = {
        folio_desparasitacion: folioDes,
        animal_id: Number(animal_id),
        producto_utilizado,
        aplicado_por,
        costo_desparasitacion: Number(costo_desparasitacion)
    }

    try {
        const deworming = await prisma.desparasitaciones.create({
            data: dewormingData
        })

        if (deworming > 0) {
            return res.status(400).json({ message: "No hay desparasitaciones actualmente" })
        }

        const rawIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

        const ip = rawIp?.replace('::ffff', '');

        await bitacora({
            usuarioId: aplicado_por,
            fecha_hora: new Date().toISOString(),
            operacion: "CREACION",
            ip,
            resultado: `Animal creado con ID ${folioDes}`
        })

        return res.status(201).json({ message: "Desparasitacion creada exitosamente", deworming })
    } catch (error) {
        res.status(500).json({ message: "Ha ocurrido un error al crear la desparasitacion", error: error.message})
    }
}

export {
    getDewormings,
    createDeworming,
    getDewormingByID
}