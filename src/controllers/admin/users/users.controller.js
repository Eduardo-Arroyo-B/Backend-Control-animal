import prisma from "../../../../prisma/prismaClient.js"
import bcrypt from "bcrypt"

const login = async (req, res) => {
    // Extraer informacion del body
    const { usuario, password } = req.body

    try {
        const findUser = await prisma.usuarios.findFirst({
            where: { username: usuario },
            select: {
                usuario_id: true,
                nombre_completo: true,
                estatus_usuario: true,
                ultimo_acceso: true,
                password: true,
                Rol: {
                    select: {
                        id: true,
                        nombre: true,
                        permisos: true
                    }
                }
            }
        });

        // Manejo de errores
        if (!findUser) {
            return res.status(404).json({ message: "El usuario no existe" })
        }

        // Compara el password en texto plano con el hasheado
        const comparePassword = await bcrypt.compare( password, findUser.password )

        // Manejo de errores
        if (!comparePassword) {
            return res.status(401).json({ message: "La contraseña no es correcta" })
        }

        return res.status(200).json({ message: "Inicio de session exitoso", findUser })
    } catch (error) {
        return res.status(500).json({ message: "Ha ocurrido un error al hacer login" });
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await prisma.usuarios.findMany({
            include: {
                Rol: true
            }
        });

        // Manejo de errores
        if (!users) {
            return res.status(400).json({ message: "No se pudieron obtener los usuarios"})
        }

        return res.status(200).json({ message: "Usuarios obtenidos exitosamente" , users })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getUserById = async (req, res) => {
    // Extraccion del id de los parametros
    const { id } = req.params;

    // Manejo de errores
    if (!id) {
        return res.status(404).json({ message: "Falta id" })
    }

    try {
        const user = await prisma.usuarios.findUnique({
            where: {
                usuario_id: id
            },
            include: {
                Rol: true
            }
        })

        // Manejo de errores
        if (!user) {
            return res.status(404).json({ message: "No se a podido obtener al usuario" })
        }

        return res.status(200).json({ message: "Usuario obtenido exitosamente", user })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const createUser = async (req, res) => {
    try {
        const {
            username,
            password,
            email,
            nombre_completo,
            rol_id,
            estatus_usuario,
        } = req.body;

        // Se valida el rol
        const rol = await prisma.rol.findUnique({
            where: { id: rol_id },
        });

        if (!rol) {
            return res.status(404).json({
                message: "El rol asignado no existe",
            });
        }

        // Email es unico
        const emailExists = await prisma.usuarios.findUnique({
            where: { email },
        });

        if (emailExists) {
            return res.status(409).json({
                message: "El email ya está registrado",
            });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.usuarios.create({
            data: {
                username,
                password: hashedPassword,
                email,
                nombre_completo,
                rol_id,
                estatus_usuario,
                ultimo_acceso: new Date(),
            },
        });

        return res.status(201).json({ message: "Usuario creado correctamente", user });
    } catch (error) {
        console.error("Error al crear usuario:", error);

        // Prisma unique error
        if (error.code === "P2002") {
            return res.status(409).json({
                message: "El email ya existe",
            });
        }

        return res.status(500).json({
            message: "Error interno del servidor",
        });
    }
};


const updateUser = async (req, res) => {
    const { id, estatus_usuario, rol_id } = req.body;

    // Validaciones básicas
    if (!id) {
        return res.status(400).json({ message: "Falta el id del usuario" });
    }

    try {
        const result = await prisma.$transaction(async (tx) => {

            // Verificar que el usuario exista
            const usuario = await tx.usuarios.findUnique({
                where: {
                    usuario_id: id
                }
            });

            if (!usuario) {
                throw new Error("Usuario no encontrado");
            }

            // Construir objeto de actualización dinámico
            const dataToUpdate = {};

            // Cambiar rol
            if (rol_id) {
                dataToUpdate.rol_id = rol_id;
            }

            // Cambiar estatus
            if (estatus_usuario) {
                dataToUpdate.estatus_usuario = estatus_usuario;
            }

            // Si no hay nada que actualizar
            if (Object.keys(dataToUpdate).length === 0) {
                throw new Error("No se enviaron campos para actualizar");
            }

            // Actualizar usuario
            const updateUser = await tx.usuarios.update({
                where: {
                    usuario_id: id
                },
                data: dataToUpdate,
                include: {
                    Rol: true,
                }
            });

            return updateUser;
        });

        return res.status(200).json({
            message: "Usuario actualizado correctamente",
            result
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};


const deleteUser = async (req, res) => {
    // Extraccion del id por parametros
    const { id } = req.params;

    // Manejo de errores
    if (!id) {
        return res.status(404).json({ message: "Falta id" })
    }

    try {
        const user = await prisma.usuarios.findUnique({
            where: {
                usuario_id: id
            },
        })

        if (!user) {
            return res.status(404).json({ message: "No se encontro el usuario a eliminar" })
        }

        const deleteUser = await prisma.usuarios.delete({
            where: {
                usuario_id: id
            },
        })

        if (!deleteUser) {
            return res.status(404).json({ message: "No se pudo eliminar al usuario" })
        }

        return res.status(200).json({ message: "Usuario eliminado exitosamente",  deleteUser })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export {
    login,
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}