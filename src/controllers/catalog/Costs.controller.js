import prisma from "../../../prisma/prismaClient.js";

const getAllCosts = async (req, res) => {}

const createCost = async (req, res) => {
    // Extraer datos del body
    const {
        nombre_servicio,
        costo,  // Tipo de servicio (Vacuna, Esterilización, Desparacitación)
        servicio_id     // ID del servicio (vacuna_id, esterilizaciones_id, o desparasitaciones_id)
    } = req.body;

    try {
        // Lógica para asignar el id correspondiente al servicio basado en el tipo de servicio
        let data = {};

        if (nombre_servicio === 'Vacuna') {
            data = {
                nombre_servicio,
                costo: Number(costo),
                vacuna_id: Number(servicio_id) // Asignamos el id de la vacuna
            };
        } else if (nombre_servicio === 'Esterilizacion') {
            data = {
                nombre_servicio,
                costo: Number(costo),
                esterilizaciones_id: Number(servicio_id) // Asignamos el id de la esterilización
            };
        } else if (nombre_servicio === 'Desparacitacion') {
            data = {
                nombre_servicio,
                costo: Number(costo),
                desparasitaciones_id: Number(servicio_id) // Asignamos el id de la desparacitación
            };
        } else {
            // Si el tipo de servicio no es válido
            return res.status(400).json({
                message: "Tipo de servicio no válido. Debe ser 'Vacuna', 'Esterilización' o 'Desparacitación'."
            });
        }

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