import prisma from "../../../prisma/prismaClient.js";

const getAllCampaigns = async (req, res) => {
    try {
        const campaigns = await prisma.campaigns.findMany()

        if (!campaigns > 0) {
            return res.status(404).send("No hay campañas actualmente")
        }

        return res.status(200).json({ message: "Campañas encontradas exitosamente", campaigns });
    } catch (error) {
        res.status(500).json({ message: "Ha ocurrido un error al obtener las campañas", error: error.message });
    }
}

const createCampaign = async (req, res) => {
    // Extraccion de datos del body
    const {
        delegacion,
        nombre,
        colonia,
        fecha,
        especie,
        servicio,
        num_lote,
        cantidad_lote
    } = req.body

    const campaignData = {
        delegacion,
        nombre,
        colonia,
        fecha: new Date(fecha),
        especie,
        servicio,
        num_lote,
        cantidad_lote: Number(cantidad_lote)
    }

    try {
        const campaign = await prisma.campaigns.create({
            data: campaignData
        })

        if (!campaign) {
            return res.status().json({ message: "No se pudo crear la campaña" })
        }

        return res.status(201).json({ message: "Campaña creada exitosamente", campaign });
    } catch (error) {
        return res.status(500).json({ message: "Ha ocurrido un error al crear la campaña", error: error.message });
    }
}

const deleteCampaign = async (req, res) => {
    // Extraer ID de los parametros
    const { id } = req.params;

    try {
        const campaign = await prisma.campaigns.delete({
            where: { id: Number(id) }
        });

        if (!campaign) {
            return res.status(404).json({ message: "No se pudo eliminar la campaña" })
        }

        return res.status(200).json({ message: "Campaña eliminada exitosamente", campaign });
    } catch (error) {
        return res.status().json({ message: "Ha ocurrido un error al eliminar la campaña", error: error.message });
    }
}

export {
    getAllCampaigns,
    createCampaign,
    deleteCampaign,
}