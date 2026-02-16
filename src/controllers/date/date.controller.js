import prisma from "../../../prisma/prismaClient.js";

const getAllDates = async (req, res) => {
    try {
        const date = await prisma.cita.findMany({
            include: {
                Propietario: true
            }
        })

        if (date > 0) {
            return res.status(200).json({ message: "No se encontraron citas" })
        }

        return res.status(200).json({ message: "Citas encontradas exitosamente", date });
    } catch (error) {
        return res.status(500).json({ message: "Ha ocurrido un error al obtener las citas", error: error.message });
    }
}

const getDate = async (req, res) => {}

const createDate = async (req, res) => {
    // Extraccion de datos del body
    const { fecha, usuarioId, servicio } = req.body;

    // Data cita
    const citaData = {
        fecha: new Date(fecha),
        usuarioId,
        servicio,
    }

    try {
        const date = await prisma.cita.create({
            data: citaData,
        })

        if (!date) {
            return res.status(404).json({ message: "No se pudo crear la cita"})
        }

        return res.status(201).json({ message: "Cita creada exitosamente", date });
    } catch (error) {
        return res.status(500).json({ message: "Ha ocurrido un error al crear la cita", error: error.message });
    }
}

export {
    getAllDates,
    getDate,
    createDate
}