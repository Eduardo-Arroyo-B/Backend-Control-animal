import prisma from "../../../prisma/prismaClient.js";
import generateFolio from "../../helpers/generateFolio.js";

const getAllCremations = async (req, res) => {
    try {
        const cremations = await prisma.cremaciones.findMany({
            include: {
                Defuncion: {
                    include: {
                        Animal: {
                            select: {
                                nombre_animal: true
                            }
                        }
                    }
                }
            }
        })

        if (!cremations) {
            return res.status(404).json({ message: "No se pudieron obtener las cremaciones" })
        }

        return res.status(200).json({ message: "Cremaciones obtenidas exitosamente", cremations })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getCremationByID = async (req, res) => {
    // Extraccion del ID por parametros
    const { id } = req.params
    
    // Manejo de errores
    if (!id) {
        return res.status(404).json({ message: "Falta ID" })
    }

    try {
        const cremation = await prisma.cremaciones.findUnique({
            where: { cremacion_id: Number(id) }
        })

        if (!cremation) {
            return res.status(404).json({ message: "No se pudo obtener la creacion" })
        }

        return res.status(200).json({ message: "Cremacion obtenida exitosamente", cremation })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const createCremation = async (req, res) => {
    // Extraccion de datos del body
    const {
        defuncion_id,
        fecha_hora_cremacion,
        peso_corporal,
        operador_horno,
        temperatura,
        duracion,
        entrega_cenizas,
        observaciones,
        registrado_por
    } = req.body

    const cremationFolio = await generateFolio("CRM")

    const cremationsData = {
        folio_cremacion: cremationFolio,
        defuncion_id: Number(defuncion_id),
        fecha_hora_cremacion: new Date(fecha_hora_cremacion),
        peso_corporal,
        operador_horno,
        temperatura,
        duracion,
        entrega_cenizas,
        observaciones,
        registrado_por
    }

    try {
        const cremation = await prisma.cremaciones.create({
            data: cremationsData,
        })

        if (!cremation) {
            return res.status(404).json({ message: "No se pudo crear la cremacion"})
        }

        return res.status(201).json({ message: "Cremacion creada exitosamente", cremation })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export {
    getAllCremations,
    getCremationByID,
    createCremation,
}