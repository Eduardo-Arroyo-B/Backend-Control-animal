import prisma from "../../../prisma/prismaClient.js";
import generateFolio from "../../helpers/generateFolio.js";
import bitacora from "../../helpers/binnacle.js";

const getAllBites = async (req, res) => {
    try {
        const bites = await prisma.mordeduras.findMany({
            include: {
                Mordeduras_Fotos: true
            }
        })

        if (!bites) {
            return res.status(404).json({ message: "No se pudieron obtener las mordeduras" })
        }

        return res.status(200).json({ message: "Mordeduras obtenidas exitosamente", bites })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getBiteById = async (req, res) => {
    // Extraccion del ID por parametros
    const { id } = req.params

    // Manejo errores
    if (!id) {
        return res.status(404).json({ message: "Falta ID"})
    }

    try {
        const bite = await prisma.mordeduras.findUnique({
            where: { mordedura_id: Number(id) },
        })

        if (!bite) {
            return res.status(404).json({ message: "No se pudo ibtener la mordedura" })
        }

        return res.status(200).json({ message: "Mordedura obtenida exitosamente",  bite })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const createBite = async (req, res) => {
    // Extraccion de datos del body
    const {
        nombre_completo,
        edad,
        telefono,
        direccion,
        fecha_incidente,
        hora_incidente,
        gravedad,
        ubicacion_incidente,
        parte_cuerpo_afectada,
        especie,
        animal_propio,
        ID_animal,
        estado_vacunacion,
        descripcion_animal,
        registrado_por
    } = req.body

    // validar si es true o false de si es animal propio
    const booleanAnimal = animal_propio === true || animal_propio === "true"

    // Generar folio unico
    const folio = await generateFolio("MD")

    // Objeto de datos de mordedura
    const biteData = {
        folio_mordedura: folio,
        nombre_completo,
        edad: Number(edad),
        telefono,
        direccion,
        fecha_incidente: new Date(fecha_incidente),
        hora_incidente: new Date(hora_incidente),
        gravedad,
        ubicacion_incidente,
        parte_cuerpo_afectada,
        especie,
        animal_propio: booleanAnimal,
        ID_animal: Number(ID_animal),
        estado_vacunacion,
        descripcion_animal
    }

    try {
        const bite = await prisma.mordeduras.create({
            data: {
                ...biteData,
                Usuarios: {
                    connect: {
                        usuario_id: registrado_por
                    }
                }
            }
        })

        if (!bite) {
            return res.status(404).json({ message: "No se pudo crear el registro de mordedura" })
        }

        // Guardar fotos si se enviaron
        if (req.files && req.files.length > 0) {
            const fotosData = req.files.map((file, index) => ({
                mordedura_id: bite.mordedura_id,
                url: file.path.replace(/\\/g, "/"),
            }))

            const mordidasFotos = await prisma.mordeduras_Fotos.createMany({
                data: fotosData
            })

            console.log("Fotos creadas", mordidasFotos)
        }

        const rawIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

        const ip = rawIp?.replace('::ffff', '');

        await bitacora({
            usuarioId: registrado_por,
            fecha_hora: new Date().toISOString(),
            operacion: "CREACION",
            ip,
            resultado: `Mordedura creada con ID ${folio}`
        })

        return res.status(201).json({ message: "Mordedura creada exitosamente", bite })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const deleteBite = async (req, res) => {
    // Extraccion del ID de parametros
    const { id } = req.params

    if (!id) {
        return res.status(404).json({ message: "Falta ID"})
    }

    try {
        const bite = await prisma.mordeduras.delete({
            where: { mordedura_id: Number(id) },
        })

        if (!bite) {
            return res.status(404).json({ message: "No se pudo eliminar la mordedura seleccionada" })
        }

        return res.status(200).json({ message: "Mordedura eliminada exitosamente", bite })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export {
    getAllBites,
    getBiteById,
    createBite,
    deleteBite,
}