import prisma from "../../../prisma/prismaClient.js";
import bitacora from "../../helpers/binnacle.js";

// Obtener todas las citas del mes
const getAgendaMes = async (req, res) => {
  try {
    const { mes, anio } = req.body;

    if (!mes || !anio) return res.status(400).json({ error: 'Faltan mes o año' });

    const start = new Date(Number(anio), Number(mes) - 1, 1);
    const end = new Date(Number(anio), Number(mes), 0, 23, 59, 59, 999);

    const citas = await prisma.Citas.findMany({
        where: { fecha: { gte: start, lte: end } },
            orderBy: { fecha: 'asc' }
    });

    return res.status(200).json({ message: "Citas del mes obtenidas exitosamente", citas})
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener citas' });
  }
};

// Obtener todas las citas del dia
const getAgendaDia = async (req, res) => {
    try{
        const { fecha } = req.body; // ej: 2025-02-08

        if (!fecha) return res.status(400).json({ error: 'Falta fecha' });

        const start = new Date(fecha);
        start.setHours(0, 0, 0, 0);
        const end = new Date(fecha);
        end.setHours(23, 59, 59, 999);

        const citas = await prisma.Citas.findMany({
            where: { fecha: { gte: start, lte: end } },
            orderBy: { fecha: 'asc' }    
    }); 

    return res.status(200).json({ message: "Citas del dia obtenidas exitosamente", citas})
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error al obtener citas' })
    }
};

const createCita = async (req, res) => {
    const {
        animal_id,
        veterinario,
        estatus_cita,
        tipo_cita,
        fecha_hora_cita,
        quirofano
    } = req.body;

    const citaData = {
        animal_id: Number(animal_id),
        veterinario,
        estatus_cita: estatus_cita || 'Pendiente',
        tipo_cita,
        fecha_hora_cita,
        quirofano: quirofano || null
    }

    try {

        if (Object.keys(citaData).length === 0) {

            return res.status(404).json({ message: "No hay campos para actualizar" })}

            const cita = await prisma.citas.create({
                data: citaData
            })

        if (!cita) {
            return res.status(404).json({ message: "No se pudo crear la cita" })
        }

        return res.status(201).json({ message: "Cita creada exitosamente" , cita });
    } catch (error) {
        return res.status(500).json({ message: "Error al crear la cita", error: error.message });
    }
}

export {
    getAgendaMes,
    getAgendaDia,
    createCita
};