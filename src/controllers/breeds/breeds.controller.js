import prisma from "../../../prisma/prismaClient.js"
import error from "multer/lib/multer-error.js";

const getAllBreeds = async (req, res) => {
    try {
        const breeds = await prisma.cat_Razas.findMany()

        if (!breeds) {
            return res.status(404).json({ message: "No se pudieron obtener las razas" })
        }

        return res.status(200).json({ message: "Razas obtenidas exitosamente", breeds })
    } catch (error) {
        return res.status(500).json({ message: "Ha ocurrido un error al obtener las razas", error: error.message })
    }
}

const getBreedsByID = async (req, res) => {
    // Extraccion del ID de los parametros
    const { id } = req.params

    try {
        const breeds = await prisma.cat_Razas.findUnique({
            where: { id: Number(id) }
        })

        if (!breeds > 0) {
            return res.status(404).json({ message: "No hay razas actualmente" })
        }

        return res.status(200).json({ message: "Raza obtenida", breeds })
    } catch (error) {
        return res.status(500).json({ message: "Ha ocurrido un error al obtener las razas", error: error.message })
    }
}

const createBreed = async (req, res) => {
    // Obtener datos del body
    const { nombre_raza, tamano, temperamento, tipo } = req.body

    try {
        const breed = await prisma.cat_Razas.create({
            data: {
                nombre_raza,
                tamano,
                temperamento,
                tipo
            }
        })

        if (!breed) {
            return res.status(200).json({ message: "No se pudo crear la raza" })
        }

        return res.status(201).json({ message: "Raza creada exitosamente", breed })
    } catch (error) {
        return res.status(500).json({ message: "Ha ocurrido un error al obtener las razas", error: error.message })
    }
}

const deleteBreed = async (req, res) => {
    // Extraccion de ID de los parametros
    const { id } = req.params

    try {
        const deleteBreed = await prisma.cat_Razas.delete({
            where: { id: Number(id) }
        })

        if (!deleteBreed) {
            return res.status().json({ message: "No se pudo eliminar la raza" })
        }

        return res.status(200).json({ message: "Raza eliminada exitosamente", deleteBreed })
    } catch (error) {
        return res.status(500).json({ message: "Ha ocurrido un error al obtener las razas", error: error.message })
    }
}

export {
    getAllBreeds,
    getBreedsByID,
    createBreed,
    deleteBreed
}