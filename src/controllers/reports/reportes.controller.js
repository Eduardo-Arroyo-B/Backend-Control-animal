import prisma from "../../../prisma/prismaClient.js";
import generateFolio from "../../helpers/generateFolio.js";

const getAllReportes = async (req, res) => {
    try {
        const reportes = await prisma.reportes_Ciudadanos.findMany({
            orderBy: {
                fecha_reporte: "desc"
            },
            include: {
                Reporte_Seguimiento: {
                    include: {
                        Usuario: {
                            select: {
                                usuario_id: true,
                                username: true,
                                nombre_completo: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        return res.status(200).json({
            message: "Reportes obtenidos exitosamente",
            reportes
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const createReporte = async (req, res) => {
    // Extraccion de datos del body
    const {
        tipo_reporte,
        prioridad,
        descripcion,
        ubicacion,
        colonia_id,
        nombre_completo,
        telefono,
        email,
        estatus_reporte,
        fecha_reporte,
        registrado_por
    } = req.body;

    // Genera folio para el reporte
    const nuevoFolio = await generateFolio("REP")

    // Objeto reporte
    const reportData = {
        folio_reporte: nuevoFolio,
        tipo_reporte,
        prioridad,
        descripcion,
        ubicacion,
        colonia_id: Number(colonia_id),
        nombre_completo,
        telefono,
        email,
        estatus_reporte,
        fecha_reporte: new Date(fecha_reporte),
        registrado_por: registrado_por || ""
    }

    try {
        const reporte = await prisma.reportes_Ciudadanos.create({
            data: reportData,
        });

        if (!reporte) {
            return res.status(404).json({ message: "No se pudo generar el reporte" })
        }

        return res.status(201).json({
            message: "Reporte registrado correctamente",
            reporte
        });
    } catch (error) {
        // Errores comunes de prisma
        if (error.code === "P2002") {
            return res.status(400).json({
                message: "Error al generar el folio. Intente nuevamente."
            });
        }

        return res.status(500).json({
            message: error.message
        });
    }
};

const createReporteSeguimiento = async (req, res) => {
    const {
        reporte_id,
        tipo_accion_seguimiento,
        responsable_id,
    } = req.body;

    // Validación de campos requeridos
    if (!reporte_id || !tipo_accion_seguimiento || !responsable_id) {
        return res.status(400).json({
            message: "Faltan campos requeridos: reporte_id, tipo_accion_seguimiento, responsable_id (o userId)"
        });
    }

    try {
        // Validar que el reporte existe
        const reporte = await prisma.reportes_Ciudadanos.findUnique({
            where: { reporte_id: Number(reporte_id) }
        });

        if (!reporte) {
            return res.status(404).json({
                message: "El reporte no existe"
            });
        }

        // Validar que el usuario existe
        const usuario = await prisma.usuarios.findUnique({
            where: { usuario_id: responsable_id }
        });

        if (!usuario) {
            return res.status(404).json({
                message: "El usuario responsable no existe"
            });
        }

        const seguimiento = await prisma.reporte_Seguimiento.create({
            data: {
                reporte_id: Number(reporte_id),
                tipo_accion_seguimiento,
                responsable_id: responsable_id
            },
        });

        return res.status(201).json({
            message: "Seguimiento de reporte registrado correctamente",
            seguimiento
        });
    } catch (error) {
        console.log(error);
        // Errores comunes de prisma
        if (error.code === "P2003") {
            return res.status(400).json({
                message: "Error de relación: El reporte o el responsable no existe"
            });
        }

        return res.status(500).json({
            message: error.message
        });
    }
};

export {
    getAllReportes,
    createReporte,
    createReporteSeguimiento
};

