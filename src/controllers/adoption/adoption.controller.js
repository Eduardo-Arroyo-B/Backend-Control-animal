import prisma from "../../../prisma/prismaClient.js";
import generateFolio from "../../helpers/generateFolio.js";

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

// ============================================
// NUEVOS ENDPOINTS PARA SOLICITUDES DE ADOPCIÓN
// ============================================

const getAllAdoptionRequests = async (req, res) => {
    try {
        const { estatus } = req.query; // Filtro opcional por estatus

        const whereClause = {};
        if (estatus) {
            whereClause.estatus_adopcion = estatus;
        }

        const solicitudes = await prisma.adopciones.findMany({
            where: whereClause,
            include: {
                Animal: {
                    select: {
                        animal_id: true,
                        nombre_animal: true,
                        especie: true,
                        Raza: true,
                        edad: true,
                        sexo: true,
                        es_adoptable: true
                    }
                },
                Adoptante: {
                    select: {
                        propietario_id: true,
                        folio_propietario: true,
                        nombre: true,
                        apellido_paterno: true,
                        apellido_materno: true,
                        telefono: true,
                        email: true
                    }
                },
                Usuarios: {
                    select: {
                        usuario_id: true,
                        nombre_completo: true,
                        email: true
                    }
                }
            },
            orderBy: {
                fecha_solicitud: 'desc'
            }
        });

        return res.status(200).json({
            message: "Solicitudes de adopción obtenidas exitosamente",
            solicitudes
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAdoptionRequestByID = async (req, res) => {
    const { search } = req.params;

    if (!search) {
        return res.status(400).json({ message: "Falta el parámetro de búsqueda" });
    }

    try {
        // Intentar convertir a número para búsqueda por ID
        const searchAsNumber = Number(search);
        const isNumeric = !isNaN(searchAsNumber) && searchAsNumber.toString() === search;

        // Construir condiciones de búsqueda
        const whereConditions = [];

        // Si es numérico, buscar por ID de solicitud
        if (isNumeric) {
            whereConditions.push({
                adopcion_id: searchAsNumber
            });
        }

        // Búsqueda por folio de adopción
        whereConditions.push({
            folio_adopcion: {
                contains: search,
                mode: 'insensitive'
            }
        });

        // Búsqueda por nombre del animal
        whereConditions.push({
            Animal: {
                nombre_animal: {
                    contains: search,
                    mode: 'insensitive'
                }
            }
        });

        // Búsqueda por datos del propietario
        whereConditions.push({
            Adoptante: {
                OR: [
                    { numero_identificacion: search },
                    { folio_propietario: { contains: search, mode: 'insensitive' } },
                    { nombre: { contains: search, mode: 'insensitive' } },
                    { apellido_paterno: { contains: search, mode: 'insensitive' } },
                    { apellido_materno: { contains: search, mode: 'insensitive' } },
                    { telefono: { contains: search } },
                    { email: { contains: search, mode: 'insensitive' } }
                ]
            }
        });

        // Buscar solicitudes que coincidan con cualquiera de las condiciones
        const solicitudes = await prisma.adopciones.findMany({
            where: {
                OR: whereConditions
            },
            include: {
                Animal: {
                    select: {
                        animal_id: true,
                        nombre_animal: true,
                        especie: true,
                        Raza: true,
                        edad: true,
                        sexo: true,
                        pelaje: true,
                        peso: true,
                        es_adoptable: true,
                        estado_salud: true
                    }
                },
                Adoptante: {
                    select: {
                        propietario_id: true,
                        folio_propietario: true,
                        tipo_identificacion: true,
                        numero_identificacion: true,
                        nombre: true,
                        apellido_paterno: true,
                        apellido_materno: true,
                        fecha_nacimiento: true,
                        genero: true,
                        telefono: true,
                        email: true,
                        colonia: true,
                        estatus_propietario: true
                    }
                },
                Usuarios: {
                    select: {
                        usuario_id: true,
                        nombre_completo: true,
                        email: true,
                        username: true
                    }
                },
                Seguimiento_Adopciones: {
                    orderBy: {
                        fecha_seguimiento: 'desc'
                    }
                }
            },
            orderBy: {
                fecha_solicitud: 'desc'
            }
        });

        if (!solicitudes || solicitudes.length === 0) {
            return res.status(404).json({ 
                message: "No se encontraron solicitudes de adopción con los criterios de búsqueda" 
            });
        }

        // Si solo hay un resultado, devolverlo como objeto único
        if (solicitudes.length === 1) {
            return res.status(200).json({
                message: "Solicitud de adopción obtenida exitosamente",
                solicitud: solicitudes[0]
            });
        }

        // Si hay múltiples resultados, devolverlos como array
        return res.status(200).json({
            message: `${solicitudes.length} solicitud(es) de adopción encontrada(s)`,
            solicitudes
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const createAdoptionRequest = async (req, res) => {
    const {
        // Datos del animal
        animal_id,
        // Datos del propietario/adoptante
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

    if (!animal_id) {
        return res.status(400).json({
            message: "Falta el campo requerido: animal_id"
        });
    }

    if (!tipo_identificacion || !numero_identificacion || !nombre || !apellido_paterno || !fecha_nacimiento || !genero || !telefono || !colonia || !estatus_propietario) {
        return res.status(400).json({
            message: "Faltan datos del propietario: tipo_identificacion, numero_identificacion, nombre, apellido_paterno, fecha_nacimiento, genero, telefono, colonia, estatus_propietario"
        });
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            // Verificar que el animal existe y es adoptable
            const animal = await tx.animales.findUnique({
                where: { animal_id: Number(animal_id) }
            });

            if (!animal) {
                throw new Error('El animal no existe');
            }

            if (!animal.es_adoptable) {
                throw new Error('El animal no está disponible para adopción');
            }

            // Buscar o crear el propietario
            let propietario = await tx.propietario.findUnique({
                where: { numero_identificacion: numero_identificacion }
            });

            if (!propietario) {
                // Crear nuevo propietario
                const folioPropietario = await generateFolio("PROP");
                
                propietario = await tx.propietario.create({
                    data: {
                        folio_propietario: folioPropietario,
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
            } else {
                // Actualizar datos del propietario existente si es necesario
                propietario = await tx.propietario.update({
                    where: { propietario_id: propietario.propietario_id },
                    data: {
                        nombre,
                        apellido_paterno,
                        apellido_materno: apellido_materno || propietario.apellido_materno,
                        email: email || propietario.email,
                        telefono,
                        colonia,
                        estatus_propietario
                    }
                });
            }

            // Verificar que no existe una solicitud pendiente para este animal y adoptante
            const solicitudExistente = await tx.adopciones.findFirst({
                where: {
                    animal_id: Number(animal_id),
                    adoptante_id: propietario.propietario_id,
                    estatus_adopcion: 'Pendiente'
                }
            });

            if (solicitudExistente) {
                throw new Error('Ya existe una solicitud pendiente para este animal y adoptante');
            }

            // Generar folio para la solicitud
            const folioAdopcion = await generateFolio("ADP");

            // Crear la solicitud de adopción (sin evaluador, se asignará en el update)
            const solicitud = await tx.adopciones.create({
                data: {
                    folio_adopcion: folioAdopcion,
                    animal_id: Number(animal_id),
                    adoptante_id: propietario.propietario_id,
                    fecha_solicitud: new Date(),
                    estatus_adopcion: 'Pendiente',
                    evaluador_id: null
                },
                include: {
                    Animal: {
                        select: {
                            animal_id: true,
                            nombre_animal: true,
                            especie: true,
                            Raza: true
                        }
                    },
                    Adoptante: {
                        select: {
                            propietario_id: true,
                            folio_propietario: true,
                            nombre: true,
                            apellido_paterno: true,
                            apellido_materno: true,
                            telefono: true,
                            email: true
                        }
                    },
                    Usuarios: {
                        select: {
                            usuario_id: true,
                            nombre_completo: true,
                            email: true
                        }
                    }
                }
            });

            return solicitud;
        });

        return res.status(201).json({
            message: "Solicitud de adopción registrada exitosamente",
            solicitud: result
        });
    } catch (error) {
        if (error.code === "P2002") {
            return res.status(400).json({
                message: "Error al generar el folio. Intente nuevamente."
            });
        }
        if (error.code === "P2003") {
            return res.status(400).json({
                message: "El animal no existe"
            });
        }

        return res.status(500).json({
            message: error.message
        });
    }
};

const updateAdoptionStatus = async (req, res) => {
    const { id } = req.params;
    const {
        estatus_adopcion,
        aprobado_por
    } = req.body;

    // Validación
    if (!id) {
        return res.status(400).json({
            message: "Falta el ID de la solicitud"
        });
    }

    if (!estatus_adopcion) {
        return res.status(400).json({
            message: "Falta el estatus de adopción"
        });
    }

    const estatusValidos = ['Aprobada', 'Rechazada', 'Cancelada'];
    if (!estatusValidos.includes(estatus_adopcion)) {
        return res.status(400).json({
            message: `Estatus inválido. Debe ser uno de: ${estatusValidos.join(', ')}`
        });
    }

    if ((estatus_adopcion === 'Aprobada' || estatus_adopcion === 'Rechazada') && !aprobado_por) {
        return res.status(400).json({
            message: "El ID del usuario evaluador es requerido para aprobar o rechazar"
        });
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            // Verificar que la solicitud existe
            const solicitud = await tx.adopciones.findUnique({
                where: { adopcion_id: Number(id) },
                include: {
                    Animal: true,
                    Adoptante: true
                }
            });

            if (!solicitud) {
                throw new Error('La solicitud de adopción no existe');
            }

            if (solicitud.estatus_adopcion !== 'Pendiente') {
                throw new Error(`La solicitud ya fue ${solicitud.estatus_adopcion}`);
            }

            // Si se aprueba o rechaza, verificar que el usuario evaluador existe
            if (estatus_adopcion === 'Aprobada' || estatus_adopcion === 'Rechazada') {
                const evaluador = await tx.usuarios.findUnique({
                    where: { usuario_id: aprobado_por }
                });

                if (!evaluador) {
                    throw new Error('El usuario evaluador no existe');
                }
            }

            // Si se aprueba, verificar que el animal sigue siendo adoptable
            if (estatus_adopcion === 'Aprobada') {
                if (!solicitud.Animal.es_adoptable) {
                    throw new Error('El animal ya no está disponible para adopción');
                }
            }

            // Actualizar el estatus de la solicitud
            // El evaluador se establece cuando se aprueba o rechaza
            const dataUpdate = {
                estatus_adopcion: estatus_adopcion
            };

            // Si se aprueba o rechaza, establecer el evaluador
            if (estatus_adopcion === 'Aprobada' || estatus_adopcion === 'Rechazada') {
                dataUpdate.evaluador_id = aprobado_por;
            }

            const solicitudActualizada = await tx.adopciones.update({
                where: { adopcion_id: Number(id) },
                data: dataUpdate,
                include: {
                    Animal: {
                        select: {
                            animal_id: true,
                            nombre_animal: true,
                            especie: true,
                            Raza: true
                        }
                    },
                    Adoptante: {
                        select: {
                            propietario_id: true,
                            folio_propietario: true,
                            nombre: true,
                            apellido_paterno: true,
                            apellido_materno: true,
                            telefono: true,
                            email: true
                        }
                    },
                    Usuarios: {
                        select: {
                            usuario_id: true,
                            nombre_completo: true,
                            email: true
                        }
                    }
                }
            });

            // Si se aprueba, marcar el animal como no adoptable y registrar egreso
            if (estatus_adopcion === 'Aprobada') {
                await tx.animales.update({
                    where: { animal_id: solicitud.animal_id },
                    data: {
                        es_adoptable: false
                    }
                });

                // Registrar el egreso del animal
                await tx.egresos_Animales.create({
                    data: {
                        animal_id: solicitud.animal_id,
                        tipo_egreso: 'Adopción',
                        fecha_hora_egreso: new Date()
                    }
                });
            }

            return solicitudActualizada;
        });

        return res.status(200).json({
            message: `Solicitud de adopción ${estatus_adopcion.toLowerCase()} exitosamente`,
            solicitud: result
        });
    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({
                message: "Solicitud de adopción no encontrada"
            });
        }

        return res.status(500).json({
            message: error.message
        });
    }
};

export {
    getAllAdoptions,
    getAdoptionByID,
    createAdoption,
    deleteAdoption,
    // Nuevos endpoints
    getAllAdoptionRequests,
    getAdoptionRequestByID,
    createAdoptionRequest,
    updateAdoptionStatus
}