import prisma from "../../../prisma/prismaClient.js";
import generateFolio from "../../helpers/generateFolio.js";

const getDewormings = async (req, res) => {
    try {
        const deworming = await prisma.desparasitaciones.findMany()

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
        animal_id,
        producto_utilizado,
        aplicado_por
    } = req.body;

    // Objeto desparasitacion
    const dewormingData = {
        animal_id: Number(animal_id),
        producto_utilizado,
        aplicado_por
    }

    try {
        const deworming = await prisma.desparasitaciones.create({
            data: dewormingData
        })

        if (deworming > 0) {
            return res.status(400).json({ message: "No hay desparasitaciones actualmente" })
        }

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