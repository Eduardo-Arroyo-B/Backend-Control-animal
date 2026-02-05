import prisma from "../../../prisma/prismaClient.js";

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

export {
    getAllMedicamentos,
    createMedicamento
};

