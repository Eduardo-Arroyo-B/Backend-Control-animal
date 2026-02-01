import prisma from "../../prisma/prismaClient.js"

const catRazasCatalogo = [
    { nombre_raza: "Abyssinian", tamano: "Mediano", temperamento: "Activo, curioso, inteligente", tipo: "Pelo corto" },
    { nombre_raza: "American Bobtail", tamano: "Grande", temperamento: "Relajado, inteligente, juguetón", tipo: "Pelo corto / semilargo" },
    { nombre_raza: "American Curl", tamano: "Mediano", temperamento: "Juguetón, curioso, afectuoso", tipo: "Pelo corto / largo" },
    { nombre_raza: "American Shorthair", tamano: "Mediano/Grande", temperamento: "Equilibrado, amigable, fácil cuidado", tipo: "Pelo corto" },
    { nombre_raza: "American Wirehair", tamano: "Mediano", temperamento: "Independiente, reservado, cariñoso", tipo: "Pelo rizado" },
    { nombre_raza: "Australian Mist", tamano: "Mediano", temperamento: "Extrovertido, gentil, tranquilo", tipo: "Pelo corto" },
    { nombre_raza: "Balinese", tamano: "Mediano", temperamento: "Afectuoso, vocal, inteligente", tipo: "Pelo largo" },
    { nombre_raza: "Bambino", tamano: "Pequeño", temperamento: "Extrovertido, afectuoso, activo", tipo: "Sin pelo / Patas cortas" },
    { nombre_raza: "Bengal", tamano: "Grande", temperamento: "Energético, curioso, atlético", tipo: "Pelo corto (Híbrido)" },
    { nombre_raza: "Birman", tamano: "Mediano/Grande", temperamento: "Tranquilo, afectuoso, social", tipo: "Pelo semilargo" },
    { nombre_raza: "Bombay", tamano: "Mediano", temperamento: "Extrovertido, cariñoso, tranquilo", tipo: "Pelo corto" },
    { nombre_raza: "Bristol", tamano: "Mediano", temperamento: "Cariñoso, juguetón, alerta", tipo: "Pelo corto" },
    { nombre_raza: "British Longhair", tamano: "Grande", temperamento: "Tranquilo, dócil, independiente", tipo: "Pelo largo" },
    { nombre_raza: "British Shorthair", tamano: "Grande", temperamento: "Calmado, equilibrado, afectuoso", tipo: "Pelo corto" },
    { nombre_raza: "Burmese", tamano: "Mediano", temperamento: "Sociable, atento, activo", tipo: "Pelo corto" },
    { nombre_raza: "Burmilla", tamano: "Mediano", temperamento: "Juguetón, afectuoso, tranquilo", tipo: "Pelo corto / semilargo" },
    { nombre_raza: "Cheetoh", tamano: "Grande", temperamento: "Social, amistoso, tranquilo", tipo: "Híbrido (Bengal/Ocicat)" },
    { nombre_raza: "Chartreux", tamano: "Grande", temperamento: "Silencioso, leal, inteligente", tipo: "Pelo corto" },
    { nombre_raza: "Chausie", tamano: "Grande", temperamento: "Activo, atlético, ágil", tipo: "Pelo corto (Híbrido)" },
    { nombre_raza: "Chinchilla", tamano: "Mediano/Grande", temperamento: "Tranquilo, elegante, cariñoso", tipo: "Pelo largo (Variedad)" },
    { nombre_raza: "Colorpoint Shorthair", tamano: "Mediano", temperamento: "Vocal, inteligente, exigente", tipo: "Pelo corto (Siamesés)" },
    { nombre_raza: "Cornish Rex", tamano: "Pequeño/Mediano", temperamento: "Juguetón, saltador, curioso", tipo: "Pelo rizado" },
    { nombre_raza: "Cymric", tamano: "Mediano", temperamento: "Inteligente, juguetón, leal", tipo: "Pelo largo (Sin cola)" },
    { nombre_raza: "Desert Lynx", tamano: "Grande", temperamento: "Inteligente, amigable, activo", tipo: "Híbrido / Orejas rizadas" },
    { nombre_raza: "Devon Rex", tamano: "Pequeño", temperamento: "Travieso, juguetón, activo", tipo: "Pelo rizado" },
    { nombre_raza: "Donskoy", tamano: "Mediano", temperamento: "Amigable, social, inteligente", tipo: "Sin pelo" },
    { nombre_raza: "Dragon Li", tamano: "Mediano", temperamento: "Leal, independiente, cazador", tipo: "Pelo corto" },
    { nombre_raza: "Dwelf", tamano: "Pequeño", temperamento: "Juguetón, cariñoso, social", tipo: "Sin pelo / Patas cortas" },
    { nombre_raza: "Egyptian Mau", tamano: "Mediano", temperamento: "Activo, leal, veloz", tipo: "Pelo corto" },
    { nombre_raza: "European Shorthair", tamano: "Mediano/Grande", temperamento: "Inteligente, juguetón, adaptable", tipo: "Pelo corto" },
    { nombre_raza: "Exotic Shorthair", tamano: "Grande", temperamento: "Tranquilo, afectuoso, juguetón", tipo: "Pelo corto" },
    { nombre_raza: "Foldex", tamano: "Mediano", temperamento: "Dócil, afectuoso, tranquilo", tipo: "Pelo corto (Orejas dobladas)" },
    { nombre_raza: "German Longhair", tamano: "Grande", temperamento: "Amable, paciente, tranquilo", tipo: "Pelo largo" },
    { nombre_raza: "German Rex", tamano: "Mediano", temperamento: "Juguetón, inteligente, curioso", tipo: "Pelo rizado" },
    { nombre_raza: "Havana Brown", tamano: "Mediano", temperamento: "Juguetón, inteligente, afectuoso", tipo: "Pelo corto" },
    { nombre_raza: "Highlander", tamano: "Grande", temperamento: "Seguro, amigable, curioso", tipo: "Orejas rizadas" },
    { nombre_raza: "Himalayan", tamano: "Grande", temperamento: "Tranquilo, afectuoso, sensible", tipo: "Pelo largo" },
    { nombre_raza: "Japanese Bobtail", tamano: "Mediano", temperamento: "Activo, inteligente, vocal", tipo: "Pelo corto / largo" },
    { nombre_raza: "Javanese", tamano: "Mediano", temperamento: "Inteligente, vocal, comunicativo", tipo: "Pelo largo" },
    { nombre_raza: "Kanaani", tamano: "Mediano", temperamento: "Inteligente, curioso, activo", tipo: "Híbrido" },
    { nombre_raza: "Khao Manee", tamano: "Mediano", temperamento: "Juguetón, social, activo", tipo: "Pelo corto" },
    { nombre_raza: "Kinkalow", tamano: "Pequeño", temperamento: "Juguetón, activo, curioso", tipo: "Orejas rizadas / Patas cortas" },
    { nombre_raza: "Korat", tamano: "Mediano", temperamento: "Afectuoso, inteligente, tímido", tipo: "Pelo corto" },
    { nombre_raza: "Kurilian Bobtail", tamano: "Mediano/Grande", temperamento: "Amigable, cazador, dócil", tipo: "Pelo corto / largo" },
    { nombre_raza: "LaPerm", tamano: "Mediano", temperamento: "Afectuoso, curioso, tranquilo", tipo: "Pelo rizado" },
    { nombre_raza: "Lambkin", tamano: "Pequeño", temperamento: "Relajado, cariñoso, tranquilo", tipo: "Pelo rizado / Patas cortas" },
    { nombre_raza: "Lykoi", tamano: "Mediano", temperamento: "Cazador, inteligente, leal", tipo: "Pelo parcial" },
    { nombre_raza: "Maine Coon", tamano: "Gigante", temperamento: "Gentil, juguetón, sociable", tipo: "Pelo largo" },
    { nombre_raza: "Manx", tamano: "Mediano", temperamento: "Cazador, inteligente, social", tipo: "Pelo corto (Sin cola)" },
    { nombre_raza: "Mekong Bobtail", tamano: "Mediano", temperamento: "Inteligente, afectuoso, curioso", tipo: "Pelo corto" },
    { nombre_raza: "Minskin", tamano: "Pequeño", temperamento: "Extrovertido, cariñoso", tipo: "Sin pelo" },
    { nombre_raza: "Munchkin", tamano: "Pequeño/Mediano", temperamento: "Alegre, activo, ágil", tipo: "Patas cortas" },
    { nombre_raza: "Nebelung", tamano: "Mediano/Grande", temperamento: "Tímido, cariñoso, tranquilo", tipo: "Pelo largo" },
    { nombre_raza: "Norwegian Forest Cat", tamano: "Gigante", temperamento: "Amigable, independiente, tranquilo", tipo: "Pelo largo" },
    { nombre_raza: "Ocicat", tamano: "Mediano", temperamento: "Activo, inteligente, ágil", tipo: "Pelo corto" },
    { nombre_raza: "Oriental Shorthair", tamano: "Mediano", temperamento: "Vocal, inteligente, exigente", tipo: "Pelo corto" },
    { nombre_raza: "Persa", tamano: "Grande", temperamento: "Tranquilo, dócil, elegante", tipo: "Pelo largo" },
    { nombre_raza: "Pixie-bob", tamano: "Grande", temperamento: "Activo, inteligente, social", tipo: "Pelo corto / semilargo" },
    { nombre_raza: "Ragdoll", tamano: "Gigante", temperamento: "Dócil, relajado, afectuoso", tipo: "Pelo largo" },
    { nombre_raza: "Russian Blue", tamano: "Mediano", temperamento: "Tímido, inteligente, silencioso", tipo: "Pelo corto" },
    { nombre_raza: "Savannah", tamano: "Grande", temperamento: "Activo, atrevido, leal", tipo: "Pelo corto (Híbrido)" },
    { nombre_raza: "Scottish Fold", tamano: "Mediano", temperamento: "Tranquilo, afectuoso, dulce", tipo: "Pelo corto / largo" },
    { nombre_raza: "Siamese", tamano: "Mediano", temperamento: "Vocal, inteligente, afectuoso", tipo: "Pelo corto" },
    { nombre_raza: "Sphynx", tamano: "Mediano", temperamento: "Extrovertido, afectuoso, curioso", tipo: "Sin pelo" },
    { nombre_raza: "Toyger", tamano: "Mediano", temperamento: "Inteligente, seguro, tranquilo", tipo: "Pelo corto" },
    { nombre_raza: "Turkish Angora", tamano: "Mediano", temperamento: "Inteligente, activo, ágil", tipo: "Pelo largo" },
    { nombre_raza: "Turkish Van", tamano: "Grande", temperamento: "Juguetón, activo, ama el agua", tipo: "Pelo semilargo" },
    { nombre_raza: "York Chocolate", tamano: "Mediano/Grande", temperamento: "Afectuoso, inteligente, atlético", tipo: "Pelo semilargo" }
];

async function createBreeads() {
    console.log("Creando catalogo de razas...");

    await prisma.cat_Razas.createMany({
        data: catRazasCatalogo,
        skipDuplicates: true
    })

    console.log("Razas creadas sin duplicados")
}

createBreeads()
    .catch((e) => {
        console.error("Error al crear el catalogo de razas", e)
    })
    .finally( async () => {
        await prisma.$disconnect()
    })