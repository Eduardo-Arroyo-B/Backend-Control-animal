import prisma from "../../../prisma/prismaClient.js";

const getAllHairs = async (req, res) => {
    try {
        const hair = await prisma.catalogo_Pelo.findMany()

        if (!hair > 0) {
            return res.status(404).json({ message: "No hay datos del catalogo de pelos actualmente" })
        }

        return res.status(200).json({ message: "Catalogo de pelaje obtenido exitosamente", hair })
    } catch(error) {
        return res.status(500).json({ message: "No se pudo obtener el catalogo de cabello", error: error.message });
    }
}

const createHair = async (req, res) => {
    // Extraccion de datos del body
    const {
        tipo_pelo,
        razas
    } = req.body;

    const hairData = {
        tipo_pelo,
        razas
    }

    try {
        const hair = await prisma.catalogo_Pelo.create({
            data: hairData
        })

        if (!hair) {
            return res.status(404).json({ message: "No se pudo crear el tipo de pelaje" })
        }

        return res.status(201).json({ message: "Tipo de pelaje creado exitosamente", hair })
    } catch(error) {
        return res.status().json({ message: "Hubo un error al crear el tipo de pelaje", error: error.message });
    }
}

const deleteHair = async (req, res) => {}

export {
    getAllHairs,
    createHair,
    deleteHair
}