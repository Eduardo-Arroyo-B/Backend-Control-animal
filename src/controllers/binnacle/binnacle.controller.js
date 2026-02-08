import prisma from "../../../prisma/prismaClient.js";

const getAllBinnacles = async (req, res) => {
    try {
        const binnacles = await prisma.bitacora_Auditoria.findMany()

        if (binnacles.length === 0) {
            return res.status(404).json({ message: "No se encontraron resultados en la bitacora de auditoria" })
        }

        return res.status(200).json({ message: "Bitacora encontrada exitosamente" })
    } catch (error) {
        return res.status(400).json({ message: "No se pudieron obtener "})
    }
}

export {
    getAllBinnacles
}