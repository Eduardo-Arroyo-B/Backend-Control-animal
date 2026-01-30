import prisma from "../../../prisma/prismaClient.js";

const getAllDeaths = async (req, res) => {
    try {
        const deats = await prisma.defunciones.findMany({
            include: {
                Animal: {
                    select: {
                        nombre_animal: true,
                        especie: true
                    }
                }
            }
        })

        if (!deats) {
            return res.status(404).json({ message: "No se encontraron cremaciones" })
        }

        return res.status(200).json({ message: "Muertes encontradas exitosamente", deats });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getDeathsById = async (req, res) => {
    // Obtener Id por parametros
    const { id } = req.params;

    if (!id) {
        return res.status(404).json({ message: "Falta ID" })
    }

    try {
        const deaths = await prisma.defunciones.findUnique({
            where: { defuncion_id: Number(id) }
        })

        if (!deaths) {
            return res.status(404).json({ message: "No se pudo obtener la cremacion" })
        }

        return res.status(200).json({ message: "Cremacion obtenida exitosamente", deaths });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const createDeaths = async (req, res) => {
    // Extraer datos del body
    const {
        animal_id,
        fecha_hora_defuncion,
        lugar_defuncion,
        causa_muerte,
        autopsia,
        disposicion_cadaver,
        observaciones,
        veterinario_responsable
    } = req.body

    const booleanAutopsia = autopsia === true || autopsia === "true";

    const deathData = {
        animal_id: Number(animal_id),
        fecha_hora_defuncion: new Date(fecha_hora_defuncion),
        lugar_defuncion,
        causa_muerte,
        veterinario_responsable,
        autopsia: booleanAutopsia,
        disposicion_cadaver,
        observaciones
    }

    try {
        const death = await prisma.defunciones.create({
            data: deathData,
        })

        const animal = await prisma.animales.update({
            where: { animal_id: Number(animal_id) },
            data: { muerto: true },
        })

        if (!death || !animal) {
            return res.status(404).json({ message: "no se pudo crear la cremacion" })
        }

        return res.status(201).json({ message: "Defuncion creada exitosamente", death, animal });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export {
    getAllDeaths,
    getDeathsById,
    createDeaths,
}