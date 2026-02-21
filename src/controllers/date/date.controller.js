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
        estado: "Pendiente"
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

const updateDate = async (req, res) => {
    // Extraer ID de los parametros
    const { id } = req.params;

    try {
        const findDate = await prisma.cita.findUnique({
            where: { id: Number(id) },
        })

        if (!findDate) {
            return res.status(404).json({ message: "No se encontro la cita a actualizar" })
        }

        const updateDate = await prisma.cita.update({
            where: { id: Number(id) },
            data: {
                estado: "Atendida"
            }
        })

        if (!updateDate) {
            return res.status(404).json({ message: "" })
        }

        return res.status(200).json({ message: "Cita actualizada exitosamente", updateDate });
    } catch (error) {
        return res.status(500).json({ message: "Ha ocurrido un error al actualizar la cita", error: error.message });
    }
}

const deleteDate = async (req, res) => {
    // Extraccion de ID de los parametros
    const { id } = req.params;

    try {
        const findDate = await prisma.cita.findUnique({
            where: { id: Number(id) },
        })

        if (!findDate) {
            return res.status(404).json({ message: "No se encontro la cita a eliminar" })
        }

        const deleteDate = await prisma.cita.delete({
            where: { id: Number(id) }
        })

        if (!deleteDate) {
            return res.status(404).json({ message: "No se pudo eliminar la cita seleccionada" })
        }

        return res.status(200).json({ message: "Cita eliminada exitosamente", deleteDate })
    } catch (error) {
        return res.status(500).json({ message: "Ha ocurrido un error al eliminar la cita", error: error.message })
    }
}

export {
    getAllDates,
    getDate,
    createDate,
    updateDate,
    deleteDate
}