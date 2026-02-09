import prisma from "../../../prisma/prismaClient.js";
import bitacora from "../../helpers/binnacle.js";

const getAllMedicamentos = async (req, res) => {
    try {
        const medicamentos = await prisma.inventario_Medicamentos.findMany({
            orderBy: {
                fecha_vencimiento: "asc"
            },
            include: {
                Usuarios: {
                    select: {
                        usuario_id: true,
                        username: true,
                        nombre_completo: true,
                        email: true
                    }
                }
            }
        });

        return res.status(200).json({
            message: "Medicamentos obtenidos exitosamente",
            medicamentos
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const createMedicamento = async (req, res) => {
    const {
        nombre_medicamento,
        fecha_vencimiento,
        cantidad_disponibles,
        unidad_medida,
        registrado_por,
        stock_alerta,
        lote
    } = req.body;

    const medicamentoData = {
        nombre_medicamento,
        fecha_vencimiento: new Date(fecha_vencimiento),
        cantidad_disponibles: Number(cantidad_disponibles),
        unidad_medida,
        registrado_por,
        stock_alerta: Number(stock_alerta),
        lote
    }

    try {
        const medicamento = await prisma.inventario_Medicamentos.create({
            data: medicamentoData,
            include: {
                Usuarios: {
                    select: {
                        usuario_id: true,
                        username: true,
                        nombre_completo: true,
                        email: true
                    }
                }
            }
        });

        const rawIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

        const ip = rawIp?.replace('::ffff', '');

        await bitacora({
            usuarioId: registrado_por,
            fecha_hora: new Date().toISOString(),
            operacion: "CREACION",
            ip,
            resultado: `Medicamento con el ID ${medicamento.medicamentos_id}`
        })

        return res.status(201).json({
            message: "Medicamento registrado correctamente",
            medicamento
        });
    } catch (error) {
        // Errores comunes de prisma
        if (error.code === "P2003") {
            return res.status(400).json({
                message: "El usuario registrador no existe"
            });
        }

        return res.status(500).json({
            message: error.message
        });
    }
};

const updateMedicamento = async (req, res) => {
    // Extraer el ID de los parametros
    const { id } = req.params;

    const {
        nombre_medicamento,
        fecha_vencimiento,
        cantidad_disponibles,
        unidad_medida,
        actualizado_por,
        stock_alerta,
        lote
    } = req.body;

    const data = {
        nombre_medicamento,
        fecha_vencimiento,
        cantidad_disponibles,
        unidad_medida,
        actualizado_por,
        stock_alerta,
        lote
    };

    try {
        if (Object.keys(data).length === 0) {
        return res.status(404).json({ message: "No hay campos para actualizar" })}
        const medicamento = await prisma.Inventario_Medicamentos.update({
            where: { medicamentos_id : Number(id) },
                data
        })

        if (!medicamento) {
            return res.status(404).json({ message: "No se pudo actualizar el medicamento" })
        }

        const rawIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
        const ip = rawIp?.replace('::ffff', '');

        await bitacora({
            usuarioId: actualizado_por,
            fecha_hora: new Date().toISOString(),
            operacion: "UPDATE",
            ip,
            resultado: `Medicamento actualizado con ID ${medicamento.medicamentos_id}`
        })
        return res.status(200).json({message: "Medicamento modificado exitosamente" , medicamento});
    } catch (error) {
        return res.status(500).json({ error: "Error al actualizar medicamento" });
    }
};

export {
    getAllMedicamentos,
    updateMedicamento,
    createMedicamento
};

