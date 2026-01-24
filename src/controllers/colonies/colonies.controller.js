import prisma from "../../../prisma/prismaClient.js";

const getAllColonies = async (req, res) => {
    try {
        const colonies = await prisma.cat_Colonias.findMany()

        if (!colonies) {
            return res.status(404).json({ message: "No se pudieron obtener las colonias" });
        }

        if (colonies.length < 1) {
            return res.status().json({ message: "No hay colonias creadas actualmente" })
        }

        return res.status(200).json({ message: "Colonias obtenidas exitosamente", colonies });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getColoniesById = async (req, res) => {}

const createColonie = async (req, res) => {
    // Extraer datos del body
    const { nombre_colonia } = req.body;

    try {
        const colonies = await prisma.cat_Colonias.create({
            data: {
                nombre_colonia,
            }
        })

        if (!colonies) {
            return res.status().json({ message: "No se pudo crear la colonia" });
        }

        return res.status(200).json({ message: "Colonia creada exitosamente", nombre_colonia });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const deleteColonie = async (req, res) => {
    // Extraccion del ID de los parametros
    const { id } = req.params;

    try {
        const colonie = await prisma.cat_Colonias.delete({
            where: {
                colonia_id: Number(id)
            }
        })

        if (!colonie) {
            return res.status(404).json({ message: "No se pudo eliminar la colonia" });
        }

        return res.status(200).json({ message: "Colonia eliminada exitosamente", colonie });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export {
    getAllColonies,
    getColoniesById,
    createColonie,
    deleteColonie
}