import prisma from "../../../prisma/prismaClient.js";
import bitacora from "../../helpers/binnacle.js";

const getAllSupplies = async (req, res) => {
    try {
        const supplies = await prisma.inventario_Insumos.findMany()

        if (!supplies) {
            return res.status(404).json({ message: "No se pudo obtener el inventario de los insumos" });
        }

        return res.status(200).json({ message: "Inventario de insumos obtenido exitosamente", supplies });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getSuppliesByID = async (req, res) => {
    // Extraccion de ID de los parametros
    const { id } = req.params;

    if (!id) {
        return res.status(404).json({ message: "Falta ID"})
    }

    try {
        const suplies = await prisma.inventario_Insumos.findUnique({
            where: { insumo_id: Number(id)}
        })

        if (!suplies) {
            return res.status(404).json({ message: "No se pudo obtener el inventario del insumo solicitado" })
        }

        return res.status(200).json({ message: "Inventario del insumo obtenido exitosamente", suplies });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const createSupplies = async (req, res) => {
    // Extraccion de datos del body
    const {
        nombre_producto,
        cantidad_disponible,
        unidad_medida,
        fecha_vencimiento,
        registrado_por,
        stock_alerta
    } = req.body

    // Objeto de datos de los insumos
    const suppliesData = {
        nombre_producto,
        cantidad_disponible: Number(cantidad_disponible),
        unidad_medida,
        fecha_vencimiento: new Date(fecha_vencimiento),
        registrado_por,
        stock_alerta: Number(stock_alerta)
    }

    try {
        const supplies = await prisma.inventario_Insumos.create({
            data: suppliesData
        })

        if (!supplies) {
            return res.status(404).json({ message: "No se pudo crear el inventario de insumo solicitado" })
        }

        const rawIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

        const ip = rawIp?.replace('::ffff', '');

        await bitacora({
            usuarioId: registrado_por,
            fecha_hora: new Date().toISOString(),
            operacion: "CREACION",
            ip,
            resultado: `Inventario creado con ID ${supplies.insumo_id}`
        })

        return res.status(201).json({ message: "Inventario de insumo creado exitosamente", supplies });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const deleteSupplies = async (req, res) => {}

export {
    getAllSupplies,
    getSuppliesByID,
    createSupplies,
    deleteSupplies
}