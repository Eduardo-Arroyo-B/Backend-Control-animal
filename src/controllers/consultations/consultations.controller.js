import prisma from "../../../prisma/prismaClient.js";
import bitacora from "../../helpers/binnacle.js";

const getConsultations = async (req, res) => {
    try {
        const consultations = await prisma.consultas_Veterinarias.findMany({
            orderBy: {
                fecha_hora_consulta: "desc"
            },
            include: {
                Animal: {
                    select: {
                        animal_id: true,
                        nombre_animal: true,
                        folio: true
                    }
                },
                Usuarios: {
                    select: {
                        usuario_id: true,
                        nombre_completo: true
                    }
                },
            }
        });

        return res.status(200).json(consultations);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getConsultationByID = async (req, res) => {
    const { id } = req.params;

    try {
        const consultation = await prisma.consultas_Veterinarias.findUnique({
            where: { consulta_id: Number(id) },
            include: {
                Animal: true,
                Usuarios: true
            }
        });

        if (!consultation) {
            return res.status(404).json({
                message: "Consulta veterinaria no encontrada"
            });
        }

        return res.status(200).json(consultation);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const createConsultation = async (req, res) => {
    const {
        animal_id,
        peso_actual,
        temperatura,
        motivo_consulta,
        diagnostico,
        tratamiento,
        observaciones,
        disponible_adopcion,
        veterinario_id,
        enfermedad_critica,
        campanas_id
    } = req.body;

    try {
        if (!animal_id || isNaN(Number(animal_id))) {
            return res.status(400).json({ message: "animal_id inválido o faltante" });
        }
        // Crear consulta
        const consultation = await prisma.consultas_Veterinarias.create({
            data: {
                animal_id: Number(animal_id),
                peso_actual: Number(peso_actual),
                temperatura: Number(temperatura),
                motivo_consulta,
                diagnostico,
                tratamiento,
                observaciones: observaciones || "",
                disponible_adopcion: Boolean(disponible_adopcion),
                veterinario_id,
                enfermedad_critica,
                campanas_id: campanas_id && !isNaN(Number(campanas_id)) 
                ? Number(campanas_id) 
                : null
            }
        });
        // Poner en adopcion
        if (disponible_adopcion){
            const animal = await prisma.animales.findUnique({
                where: { animal_id: Number(animal_id) },
                select: { estado_reproductivo: true }
            });
            if (!animal) {
                return res.status(404).json({ message: "Animal no encontrado" });
            }
            /*
            if (animal.estado_reproductivo !== "Esterilizado") {
                return res.status(400).json({ message: "El animal debe estar esterilizado para ponerlo en adopción." });
            }
            */

            const EnCuarentena = await prisma.cuarentenas.findFirst({
                where: { animal_id: Number(animal_id),
                    estatus_cuarentena: "Activa"
                 },
                select: { cuarentena_id: true },
            });

            if (EnCuarentena){
                return res.status(400).json({ message: "El animal se encuentra en cuarentena." });
            }
            
            await prisma.animales.update({
            where: { animal_id: Number(animal_id) },
            data: { 
                es_adoptable: true,                                                                                              
                },
            })
            if (!animal) {
            return res.status(404).json({ message: "No se pudo poner en adopcion al animal" });
            }
        }
        if (!consultation ) {
            return res.status(404).json({ message: "No se pudo crear la consulta" });
        }

        // Bitacora
        const rawIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

        const ip = rawIp?.replace('::ffff', '');

        await bitacora({
            usuarioId: veterinario_id,
            fecha_hora: new Date().toISOString(),
            operacion: "CREACION",
            ip,
            resultado: `Consulta creada con ID ${animal_id}`
        })

        return res.status(201).json({
            message: "Consulta veterinaria registrada correctamente",
            data: consultation
        });

    } catch (error) {
        // Errores comunes en prisma
        if (error.code === "P2003") {
            return res.status(400).json({
                message: "Animal o veterinario no existe"
            });
        }

        return res.status(500).json({ message: error.message });
    }
};

const deleteConsultation = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.consultas_Veterinarias.delete({
            where: { consulta_id: Number(id) }
        });

        return res.status(200).json({
            message: "Consulta veterinaria eliminada correctamente"
        });
    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({
                message: "Consulta veterinaria no encontrada"
            });
        }

        return res.status(500).json({ message: error.message });
    }
};

export {
    getConsultations,
    getConsultationByID,
    createConsultation,
    deleteConsultation
};
