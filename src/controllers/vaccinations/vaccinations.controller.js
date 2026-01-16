import prisma from "../../../prisma/prismaClient.js";

const getVaccinations = async (req, res) => {
    try {
        const vaccinations = await prisma.vacunaciones.findMany({
            orderBy: {
                fecha_aplicacion: "desc"
            },
            include: {
                Animal: {
                    select: {
                        animal_id: true,
                        nombre: true,
                        especie_animal: true
                    }
                },
                Vacuna: {
                    select: {
                        id: true,
                        nombre_vacuna: true
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

        return res.status(200).json(vaccinations);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getVaccinationByID = async (req, res) => {
    const { id } = req.params;

    try {
        const vaccination = await prisma.vacunaciones.findUnique({
            where: { id: Number(id) },
            include: {
                Animal: true,
                Vacuna: true,
                Usuarios: true
            }
        });

        if (!vaccination) {
            return res.status(404).json({ message: "Vacunación no encontrada" });
        }

        return res.status(200).json(vaccination);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const createVaccination = async (req, res) => {
    const {
        animal_id,
        vacuna_id,
        lote,
        fecha_aplicacion,
        proxima_dosis,
        observaciones,
        veterinario_Id
    } = req.body;

    try {
        const vaccination = await prisma.vacunaciones.create({
            data: {
                animal_id: Number(animal_id),
                vacuna_id: Number(vacuna_id),
                lote,
                fecha_aplicacion: new Date(fecha_aplicacion),
                proxima_dosis: proxima_dosis
                    ? new Date(proxima_dosis)
                    : null,
                observaciones: observaciones || "",
                veterinario_Id
            }
        });

        return res.status(201).json({
            message: "Vacunación registrada correctamente",
            data: vaccination
        });

    } catch (error) {
        // Errores comunes de prisma
        if (error.code === "P2003") {
            return res.status(400).json({
                message: "Animal, vacuna o veterinario no existe"
            });
        }

        return res.status(500).json({
            message: error.message
        });
    }
};

const deleteVaccination = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.vacunaciones.delete({
            where: { id: Number(id) }
        });

        return res.status(200).json({
            message: "Vacunación eliminada correctamente"
        });
    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({
                message: "Vacunación no encontrada"
            });
        }

        return res.status(500).json({ message: error.message });
    }
};

export {
    getVaccinations,
    getVaccinationByID,
    createVaccination,
    deleteVaccination
};
