import prisma from "../../../prisma/prismaClient.js";

const getAllAlimentos = async (req, res) => {
    try {
        const alimentos = await prisma.inventario_Alimento.findMany({
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
            message: "Alimentos obtenidos exitosamente",
            alimentos
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const createAlimento = async (req, res) => {
    const {
        nombre_producto,
        tipo_alimento,
        fecha_vencimiento,
        cantidad_disponible_kg,
        registrado_por,
        stock_alerta
    } = req.body;

    // Validación de campos requeridos
    if (!nombre_producto || !tipo_alimento || !fecha_vencimiento || !cantidad_disponible_kg || !registrado_por) {
        return res.status(400).json({
            message: "Faltan campos requeridos: nombre_producto, tipo_alimento, fecha_vencimiento, cantidad_disponible_kg, registrado_por"
        });
    }

    try {
        const alimento = await prisma.inventario_Alimento.create({
            data: {
                nombre_producto,
                tipo_alimento,
                fecha_vencimiento: new Date(fecha_vencimiento),
                cantidad_disponible_kg: Number(cantidad_disponible_kg),
                registrado_por,
                stock_alerta: Number(stock_alerta),
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

        return res.status(201).json({
            message: "Alimento registrado correctamente",
            alimento
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
    getAllAlimentos,
    createAlimento
};

