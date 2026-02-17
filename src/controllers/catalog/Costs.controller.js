import prisma from "../../../prisma/prismaClient.js";

const getAllCosts = async (req, res) => {
    try {
        const costos = await prisma.tabla_Costos.findMany()

        if (costos.length === 0) {
            return res.status(404).json({ message: "No existen datos actualmente en el catalogo de costos" })
        }

        return res.status(200).json({ message: "Catalogo de costos obtenido exitosamente", costos });
    } catch (error) {
        return res.status(500).json({ message: "Ha ocurrido un error al obtener la tabla de costos", error: error.message });
    }
}

const createCost = async (req, res) => {
    // Extraer datos del body
    const {
        nombre_servicio,
        costo,  // Tipo de servicio (Vacuna, Esterilización, Desparacitación)
        servicio_id     // ID del servicio (vacuna_id, esterilizaciones_id, o desparasitaciones_id)
    } = req.body;

    // Objeto
    const data = {
        nombre_servicio,
        costo,
    }

    try {
        // Crear el nuevo costo en la base de datos
        const cost = await prisma.tabla_Costos.create({
            data,
        });

        if (!cost) {
            return res.status(400).json({ message: "Ha ocurrido un error al crear el costo" });
        }

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