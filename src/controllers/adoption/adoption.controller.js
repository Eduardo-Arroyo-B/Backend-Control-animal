import prisma from "../../../prisma/prismaClient.js";

const getAllAdoptions = async (req,res) => {
    try {
        const adoptions = await prisma.adopciones.findMany({
            include: {
                Animal: true,
                Adoptante: true,
            }
        })

        if (!adoptions) {
            return res.status(404).json({ message: "No se pudieron obtener las adopciones" })
        }

        return res.status(200).json({ message: "Adopciones obtenidas exitosamente", adoptions })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getAdoptionByID = async (req,res) => {
    // Extraccion del ID por parametros
    const { id } = req.params

    // Manejo de errores
    if (!id) {
        return res.status(404).json({ message: "Falta ID" })
    }

    try {
        const adoption = await prisma.adopciones.findUnique({
            where: {
                adopcion_id: Number(id)
            }
        })

        if (!adoption) {
            return res.status(404).json({ message: "No se pudo obtener la adopcion" })
        }

        return res.status(200).json({ message: "Adopcion obtenida", adoption })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const createAdoption = async (req,res) => {
    // Extraccion de datos del body
    const {
        animal_id,
        adoptante_id,
        fecha_adopcion,
        costo_adopcion,
        evaluador_id
    } = req.body

    try {
        const result = await prisma.$transaction(async (tx) => {

            const adoptante = await tx.propietario.findUnique({
                where: { propietario_id: adoptante_id }
            })

            if (!adoptante) throw new Error('El adoptante no existe')

            const evaluador = await tx.usuarios.findUnique({
                where: { usuario_id: evaluador_id }
            })

            if (!evaluador) throw new Error('El usuario no existe')
            console.log(evaluador)

            const adoption = await tx.adopciones.create({
                data: {
                    fecha_adopcion: new Date(fecha_adopcion),
                    costo_adopcion,
                    Animal: { connect: { animal_id: Number(animal_id) } },
                    Adoptante: { connect: { propietario_id: adoptante_id } },
                    Usuarios: { connect: { usuario_id: evaluador_id } }
                }
            })

            return adoption
        })


        return res.status(201).json({ message: "Adopcion creada exitosamente", result })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const deleteAdoption = async (req,res) => {
    // Extracion del ID por parametros
    const { id } = req.params

    if (!id) {
        return res.status(404).json({ message: "Falta ID" })
    }

    try {
        const deleteAdoption = await prisma.adopciones.delete({
            where: {
                id: Number(id)
            }
        })

        if (!deleteAdoption) {
            return res.status(404).json({ message: "No se pudo eliminar la adopcion" })
        }

        return res.status(200).json({ message: "Adopcion eliminada exitosamente", deleteAdoption })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export {
    getAllAdoptions,
    getAdoptionByID,
    createAdoption,
    deleteAdoption
}