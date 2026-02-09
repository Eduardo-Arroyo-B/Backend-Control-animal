import prisma from "../../../prisma/prismaClient.js";
import generateFolio from "../../helpers/generateFolio.js";
import bitacora from "../../helpers/binnacle.js";

const getAllDeaths = async (req, res) => {
    try {
        const deats = await prisma.defunciones.findMany({
            include: {
                Animal: {
                    include: true
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
    const { search } = req.params;

    if (!search) {
        return res.status(404).json({ message: "Faltan parametros de busqueda" })
    }

    try {
        const deaths = await prisma.defunciones.findMany({
            where: {
                Animal: {
                    OR: [
                        { folio: { contains: search, mode: "insensitive" } },
                        { nombre_animal: { contains: search, mode: "insensitive" } },
                        { folio: { contains: search, mode: "insensitive" } },
                    ]
                },
            },
            include: {
                Animal: {
                    select: {
                        animal_id: true,
                        folio: true,
                        nombre_animal: true
                    }
                }
            }
        });

        if (!deaths) {
            return res.status(404).json({
                message: "No se encontraron defunciones para ese animal"
            });
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
        veterinario_responsable,
        costo_defuncion
    } = req.body

    const booleanAutopsia = autopsia === true || autopsia === "true";
    const folioNew = await generateFolio("DF")

    const deathData = {
        folio: folioNew,
        Animal: {
            connect: { animal_id: animal_id}
        },
        fecha_hora_defuncion: new Date(fecha_hora_defuncion),
        lugar_defuncion,
        causa_muerte,
        Usuarios: {
            connect: { usuario_id: veterinario_responsable}
        },
        autopsia: booleanAutopsia,
        disposicion_cadaver,
        observaciones,
        costo_defuncion: Number(costo_defuncion)
    }

    try {
        if (!animal_id || isNaN(Number(animal_id))) {
            return res.status(400).json({ message: "animal_id inválido o faltante" });
        }
        const death = await prisma.defunciones.create({
            data: deathData,
        })

        const animal = await prisma.animales.update({
            where: { animal_id: Number(animal_id) },
            data: { 
                muerto: true,
                estado_salud: "Finido"
            },
        })

        if (!death || !animal) {
            return res.status(404).json({ message: "no se pudo crear la cremacion" })
        }

        const rawIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

        const ip = rawIp?.replace('::ffff', '');

        await bitacora({
            usuarioId: veterinario_responsable,
            fecha_hora: new Date().toISOString(),
            operacion: "CREACION",
            ip,
            resultado: `Defuncion creada con ID ${folioNew}`
        })

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