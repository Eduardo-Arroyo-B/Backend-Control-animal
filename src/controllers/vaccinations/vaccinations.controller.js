import prisma from "../../../prisma/prismaClient.js";

const getVaccinations = async (req, res) => {
    try {
        const vaccinations = await prisma.vacunaciones.findMany({
            orderBy: {
                fecha_aplicacion: "desc"
            },
            include: {
                Animal: {
                    include: {
                        RazaCatalogo: {
                            select: {
                                nombre_raza: true
                            }
                        }
                    }
                },
                Vacuna: true,
                Usuarios: true
            },
            take: 10
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
        veterinario_Id,
        zona,
        campaña
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
                veterinario_Id,
                zona,
                campaña
            }
        });

        // Busca la vacuna y le resta 1 al stock
        const vaccinationUpdate = await prisma.inventario_Vacunas.update({
            where: {
                id: Number(vacuna_id)
            },
            data: {
                cantidad_disponible: {
                    decrement: 1
                }
            }
        })

        if (vaccinationUpdate.cantidad_disponible <= 0) {
            return res.status(404).json({ message: "Ya no hay stock de la vacuna"})
        }

        if (!vaccinationUpdate) {
            return res.status(404).json({ message: "No se pudo actualizar el stock de la vacuna" })
        }

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

const getCatVaccination = async (req, res) => {
    try {
        const vaccinations = await prisma.inventario_Vacunas.findMany({
            orderBy: {
                id: "asc"
            },
            take: 10
        })

        if (!vaccinations) {
            return res.status(404).json({ message: "No se pudo obtener el stock de vacunas disponible"})
        }

        return res.status(200).json({ message: "Stock de vacunas obtenido exitosamente", vaccinations });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getCatVaccinationByID = async (req, res) => {
    // Extraccion del id de parametros
    const { id } = req.params;

    // Manejo de errores
    if (!id) {
        return res.status(404).json({ message: "Falta ID"})
    }

    try {
        const vaccinations = await prisma.inventario_Vacunas.findUnique({
            where: { id: Number(id) },
        })

        if (!vaccinations) {
            return res.status(404).json({ message: "No se pudo obtener el stock de vacunas disponible"})
        }

        return res.status(200).json({ message: "Stock de vacunas obtenido exitosamente", vaccinations });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const createCatVaccination = async (req, res) => {
    // Extraccion de datos del body
    const {
        nombre_vacuna,
        lote,
        cantidad_disponible,
        unidad_medida,
        fecha_vencimiento,
        stock_alerta
    } = req.body;

    const dataVaccinations = {
        nombre_vacuna,
        lote,
        cantidad_disponible: Number(cantidad_disponible),
        unidad_medida,
        fecha_vencimiento,
        stock_alerta: Number(stock_alerta)
    }

    try {
        const vaccination = await prisma.inventario_Vacunas.create({
            data: dataVaccinations
        })

        if (!vaccination) {
            return res.status(404).json({ message: "No se pudo crear el stock de vacunas" });
        }

        return res.status(201).json({ message: "Stock de vacunas creado exitosamente", dataVaccinations });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

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
    getCatVaccination,
    getCatVaccinationByID,
    createCatVaccination,
    deleteVaccination
};
