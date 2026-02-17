import prisma from "../../../prisma/prismaClient.js";

const getAllCosts = async (req, res) => {
    try {
        const catalog = await prisma.tabla_Costos.findMany()

        if (catalog.length === 0) {
            return res.status(200).json({ message: "No hay datos de costos actualmente"});
        }

        return res.status(200).json({ message: "Catalogo de costos obtenido exitosamente", catalog });
    } catch (error) {
        return res.status(500).json({ message: "Ha ocurrido un error al obtener el catalogo de costos", error: error.message });
    }
}

const createCost = async (req, res) => {
    // Extraer datos del body
    const {
        nombre_servicio,
        costo,
        servicio_id     // ID del servicio (vacuna_id, esterilizaciones_id, o desparasitaciones_id)
    } = req.body;

    // data
    const data = {
        nombre_servicio,
        costo: Number(costo),
    }

    try {
        // Crear el nuevo costo en la base de datos
        const cost = await prisma.tabla_Costos.create({
            data,
        });

        return res.status(201).json({
            message: "Costo creado exitosamente",
            cost,
        });
    } catch (error) {
        return res.status(400).json({
            message: "Ha ocurrido un error al crear el costo",
            error: error.message,
        });
    }
};


export {
    getAllCosts,
    createCost,
}