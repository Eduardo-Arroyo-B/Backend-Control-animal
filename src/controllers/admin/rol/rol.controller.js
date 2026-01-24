import prisma from "../../../../prisma/prismaClient.js";

const getRoles = async (req, res) => {
    try {
        const roles = await prisma.rol.findMany()

        if (!roles) {
            return res.status(404).json({ message: "No se pudieron consultar los roles"})
        }

        if (roles.length < 0) {
            return res.status(200).json({ message: "No hay roles creados"})
        }

        return res.status(200).json({ message: "Roles obtenidos exitosamente", roles })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const createRole = async (req, res) => {
    const { nombre, permisos } = req.body;

    // Proteccion critica
    if (permisos?.sistema) {
        return res.status(403).json({
            message: "No puedes crear roles con permisos de sistema"
        });
    }

    try {
        const findRole = await prisma.rol.findUnique({
            where: {
                nombre
            }
        })

        if (findRole) {
            return res.status(404).json({ message: "El rol a crear ya existe" })
        }

        const role = await prisma.rol.create({
            data: { nombre, permisos }
        });

        return res.status(201).json({ message: "Rol creado exitosamente", role });
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
};

const superAdmin = async (req, res) => {
    try {
        const superAdmin = await prisma.rol.create({
            data: {
                nombre: "Administrador",
                permisos: {
                    "sistema": {
                        "roles": ["create", "read", "update"],
                        "usuarios": ["create", "read", "update"],
                    },
                    "modulos": {
                        "dashboard": ["create", "read", "update", "delete"],
                        "afiliados": ["create", "read", "update", "delete"],
                        "ciudadanos": ["create", "read", "update", "delete"],
                        "usuarios": ["create", "read", "update", "delete"],
                        "medicos": ["create", "read", "update", "delete"],
                        "lugares_trabajo": ["create", "read", "update", "delete"],
                        "laboratorios": ["create", "read", "update", "delete"],
                        "notas_medicas_cs": ["create", "read", "update", "delete"],
                        "notas_medicas_alm": ["create", "read", "update", "delete"],
                        "examenes_cs": ["create", "read", "update", "delete"],
                        "certificados_alm": ["create", "read", "update", "delete"]
                    }
                }
            }
        })

        if (!superAdmin) {
            return res.status(404).json({ message: "No se pudo crear el rol super admin" })
        }

        return res.status(201).json({ message: "Rol super admin creado exitosamente", superAdmin })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const deleteRol = async (req, res) => {
    // Extracicon del id del params
    const { id } = req.params;

    if (!id) {
        return res.status(404).json({ message: "Falta ID" })
    }

    try {
        const role = await prisma.rol.findUnique({
            where: {
                id
            }
        })

        if (!role) {
            return res.status(404).json({ message: "El rol a eliminar no existe" })
        }

        const deleteRole = await prisma.rol.delete({
            where: {
                id
            }
        })

        if (!deleteRole) {
            return res.status(404).json({ message: "Error al eliminar el rol" })
        }

        return res.status(200).json({ message: "Rol eliminado exitosamente", role })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export {
    getRoles,
    createRole,
    deleteRol
}