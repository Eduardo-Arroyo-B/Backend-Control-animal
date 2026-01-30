import prisma from "../../../prisma/prismaClient.js";
import generateFolio from "../../helpers/generateFolio.js";

const getAllPropietarios = async (req, res) => {
    try {
        const propietarios = await prisma.propietario.findMany({
            orderBy: {
                nombre: "asc"
            },
            include: {
                Animales: true
            }
        });

        return res.status(200).json({
            message: "Propietarios obtenidos exitosamente",
            propietarios
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAllPropietariosEXP = async (req, res) => {
    try {
        const propietarios = await prisma.propietario.findMany({
            orderBy: {
                nombre: "asc"
            },
            include: {
                Adopciones: true,
                Esterilizaciones: true,
                Pago_Servicios: true,
            }
        });

        return res.status(200).json({
            message: "Propietarios obtenidos exitosamente",
            propietarios
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getPropietarioById = async (req, res) => {
    const { search } = req.params;

    if (!search) {
        return res.status(400).json({
            message: "Falta el ID del propietario"
        });
    }

    const terms = search.split(" ").filter(Boolean);

    try {
        const propietario = await prisma.propietario.findMany({
            where: {
                AND: terms.map(term => ({
                    OR: [
                        // Busqueda exactas
                        { numero_identificacion: term },

                        // Busqueda parciales
                        { nombre: { contains: term, mode: "insensitive" }},
                        { apellido_paterno: { contains: term, mode: "insensitive" }},
                        { apellido_materno: { contains: term, mode: "insensitive" }},
                    ]
                }))
            },
            include: {
                Adopciones: {
                    select: {
                        adopcion_id: true,
                        fecha_solicitud: true
                    }
                },
                Esterilizaciones: {
                    select: {
                        esterilizacion_id: true,
                        folio_servicio: true,
                        fecha_cirujia: true,
                        tipo: true
                    }
                },
            }
        });

        if (!propietario) {
            return res.status(404).json({
                message: "Propietario no encontrado"
            });
        }

        return res.status(200).json({
            message: "Propietario obtenido exitosamente",
            propietario
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const createPropietario = async (req, res) => {
    const {
        tipo_identificacion,
        numero_identificacion,
        nombre,
        apellido_paterno,
        apellido_materno,
        fecha_nacimiento,
        genero,
        email,
        telefono,
        colonia,
        estatus_propietario
    } = req.body;

    // Validación de campos requeridos
    if (!tipo_identificacion || !numero_identificacion || !nombre || !apellido_paterno || !fecha_nacimiento || !genero || !telefono || !colonia || !estatus_propietario) {
        return res.status(400).json({
            message: "Faltan campos requeridos: tipo_identificacion, numero_identificacion, nombre, apellido_paterno, fecha_nacimiento, genero, telefono, colonia, estatus_propietario"
        });
    }

    const folioUnicoProp = await generateFolio("PROP")

    try {
        const propietario = await prisma.propietario.create({
            data: {
                folio_propietario: folioUnicoProp,
                tipo_identificacion,
                numero_identificacion,
                nombre,
                apellido_paterno,
                apellido_materno: apellido_materno || "",
                fecha_nacimiento: new Date(fecha_nacimiento),
                genero,
                email: email || "",
                telefono,
                colonia,
                estatus_propietario
            }
        });

        return res.status(201).json({
            message: "Propietario registrado correctamente",
            propietario
        });
    } catch (error) {
        // Errores comunes de prisma
        if (error.code === "P2002") {
            return res.status(400).json({
                message: "El número de identificación ya existe"
            });
        }

        return res.status(500).json({
            message: error.message
        });
    }
};

const updatePropietario = async (req, res) => {
    const { id } = req.params;
    const {
        tipo_identificacion,
        numero_identificacion,
        nombre,
        apellido_paterno,
        apellido_materno,
        fecha_nacimiento,
        genero,
        email,
        telefono,
        colonia,
        estatus_propietario
    } = req.body;

    if (!id) {
        return res.status(400).json({
            message: "Falta el ID del propietario"
        });
    }

    try {
        // Verificar que el propietario existe
        const propietarioExistente = await prisma.propietario.findUnique({
            where: { propietario_id: id }
        });

        if (!propietarioExistente) {
            return res.status(404).json({
                message: "Propietario no encontrado"
            });
        }

        // Preparar los datos a actualizar
        const datosActualizar = {};
        if (tipo_identificacion !== undefined) datosActualizar.tipo_identificacion = tipo_identificacion;
        if (numero_identificacion !== undefined) datosActualizar.numero_identificacion = numero_identificacion;
        if (nombre !== undefined) datosActualizar.nombre = nombre;
        if (apellido_paterno !== undefined) datosActualizar.apellido_paterno = apellido_paterno;
        if (apellido_materno !== undefined) datosActualizar.apellido_materno = apellido_materno;
        if (fecha_nacimiento !== undefined) datosActualizar.fecha_nacimiento = new Date(fecha_nacimiento);
        if (genero !== undefined) datosActualizar.genero = genero;
        if (email !== undefined) datosActualizar.email = email;
        if (telefono !== undefined) datosActualizar.telefono = telefono;
        if (colonia !== undefined) datosActualizar.colonia = colonia;
        if (estatus_propietario !== undefined) datosActualizar.estatus_propietario = estatus_propietario;

        const propietario = await prisma.propietario.update({
            where: { propietario_id: id },
            data: datosActualizar
        });

        return res.status(200).json({
            message: "Propietario actualizado correctamente",
            propietario
        });
    } catch (error) {
        // Errores comunes de prisma
        if (error.code === "P2002") {
            return res.status(400).json({
                message: "El número de identificación ya existe"
            });
        }
        if (error.code === "P2025") {
            return res.status(404).json({
                message: "Propietario no encontrado"
            });
        }

        return res.status(500).json({
            message: error.message
        });
    }
};

const vinculatePropietarioAnimal = async (req, res) => {
    const { id_animal, id_propietario } = req.body;

    if (!id_animal || !id_propietario) {
        return res.status(400).json({ message: "Faltan datos" });
    }

    try {
        const animal = await prisma.animales.update({
            where: {
                animal_id: Number(id_animal),
            },
            data: {
                propietario_id: id_propietario,
            },
        });

        return res.status(200).json({
            message: "Animal vinculado al propietario correctamente",
            animal,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error al vincular propietario con animal",
            error: error.message,
        });
    }
};


const deletePropietario = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: "Falta el ID del propietario"
        });
    }

    try {
        await prisma.propietario.delete({
            where: { propietario_id: id }
        });

        return res.status(200).json({
            message: "Propietario eliminado correctamente"
        });
    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({
                message: "Propietario no encontrado"
            });
        }

        return res.status(500).json({
            message: error.message
        });
    }
};

export {
    getAllPropietarios,
    getPropietarioById,
    getAllPropietariosEXP,
    createPropietario,
    updatePropietario,
    vinculatePropietarioAnimal,
    deletePropietario
};

