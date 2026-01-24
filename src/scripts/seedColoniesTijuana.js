import prisma from "../../prisma/prismaClient.js";

const coloniasTijuana = [
    "Zona Centro",
    "Zona Norte",
    "Zona Río",
    "Otay Universidad",
    "Otay Industrial",
    "Otay Constituyentes",
    "La Mesa",
    "Mesa de Otay",
    "Playas de Tijuana",
    "Sol de Tijuana",
    "Villa Fontana",
    "Villa del Campo",
    "Villa del Real",
    "El Florido",
    "Florido 1ra Sección",
    "Florido 2da Sección",
    "Mariano Matamoros",
    "Mariano Matamoros Centro",
    "Mariano Matamoros Norte",
    "Mariano Matamoros Sur",
    "El Rubí",
    "Buenos Aires",
    "Altiplano",
    "Lomas Taurinas",
    "Cañón del Sainz",
    "Cañón de la Pedrera",
    "Camino Verde",
    "Infonavit Latinos",
    "Infonavit Presidentes",
    "Infonavit Patrimonio",
    "Guaycura",
    "Insurgentes",
    "Sánchez Taboada",
    "Sánchez Taboada Produtsa",
    "Libertad",
    "Libertad Parte Alta",
    "Libertad Parte Baja",
    "20 de Noviembre",
    "La Postal",
    "Hidalgo",
    "Chapultepec",
    "Chapultepec Alamar",
    "Chapultepec 9na Sección",
    "Alamar",
    "Presidentes",
    "Defensores de Baja California",
    "El Tecolote",
    "Valle Verde",
    "Santa Fe",
    "Paseos del Florido",
    "Delicias",
    "Terrazas del Valle",
    "Lomas del Valle",
    "Urbi Villa del Prado",
    "Hacienda Las Delicias"
];

const seedColonias = async () => {
    console.log("Insertando colonias de Tijuana...");

    for (const colonia of coloniasTijuana) {
        await prisma.cat_Colonias.upsert({
            where: { nombre_colonia: colonia },
            update: {},
            create: { nombre_colonia: colonia }
        });
    }

    console.log("Colonias insertadas sin duplicados");
};

seedColonias()
    .catch((e) => {
        console.error("Error al insertar colonias:", e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
