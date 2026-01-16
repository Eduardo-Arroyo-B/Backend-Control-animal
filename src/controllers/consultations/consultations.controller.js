import prisma from "../../../prisma/prismaClient.js";

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
                        nombre: true,
                        especie_animal: true,
                        estatus_animal: true
                    }
                },
                Usuarios: {
                    select: {
                        usuario_id: true,
                        nombre_completo: true
                    }
                }
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
        veterinario_id
    } = req.body;

    try {
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
                veterinario_id
            }
        });

        if (!consultation) {
            return res.status(404).json({ message: "No se pudo crear la consulta" });
        }

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
