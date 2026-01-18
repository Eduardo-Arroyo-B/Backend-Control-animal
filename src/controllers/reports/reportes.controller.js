import prisma from "../../../prisma/prismaClient.js";

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
    const {
        tipo_reporte,
        descripcion,
        ubicacion,
        colonia,
        prioridad,
        estatus_reporte,
        fecha_reporte,
        asignado_a
    } = req.body;

    // Validación de campos requeridos
    if (!tipo_reporte || !descripcion || !ubicacion || !colonia || !prioridad || !fecha_reporte) {
        return res.status(400).json({
            message: "Faltan campos requeridos: tipo_reporte, descripcion, ubicacion, colonia, prioridad, estatus_reporte, fecha_reporte"
        });
    }

    try {
        // Obtener el último reporte para generar el siguiente folio
        const ultimoReporte = await prisma.reportes_Ciudadanos.findFirst({
            orderBy: {
                reporte_id: "desc"
            }
        });

        // Generar el nuevo folio
        let nuevoFolio;
        const añoActual = new Date().getFullYear();

        if (ultimoReporte && ultimoReporte.folio_reporte) {
            // Extraer el número del último folio
            // Formato esperado: REP-YYYY-NNN o similar
            const match = ultimoReporte.folio_reporte.match(/(\d+)$/);
            if (match) {
                const ultimoNumero = parseInt(match[1], 10);
                const siguienteNumero = ultimoNumero + 1;
                nuevoFolio = `REP-${añoActual}-${String(siguienteNumero).padStart(3, '0')}`;
            } else {
                // Si no se puede parsear, empezar desde 1
                nuevoFolio = `REP-${añoActual}-001`;
            }
        } else {
            // Si no hay reportes previos, empezar desde 1
            nuevoFolio = `REP-${añoActual}-001`;
        }

        const reporte = await prisma.reportes_Ciudadanos.create({
            data: {
                folio_reporte: nuevoFolio,
                tipo_reporte,
                descripcion,
                ubicacion,
                colonia,
                prioridad,
                estatus_reporte,
                fecha_reporte: new Date(fecha_reporte),
                asignado_a: asignado_a || ""
            }
        });

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

