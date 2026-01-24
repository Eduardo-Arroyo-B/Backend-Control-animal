import express from 'express';
import cors from 'cors';
import path from 'path';

// SICA
import animales from "../routes/animals/animal.routes.js"
import vaccinations from "../routes/vaccionations/vaccinations.routes.js"
import consultations from "../routes/consultations/consultations.routes.js"
import usuarios from "../routes/admin/users/users.routes.js"
import roles from "../routes/admin/rol/rol.routes.js"
import medicamentos from "../routes/inventory/medicamentos.routes.js"
import alimentos from "../routes/inventory/alimentos.routes.js"
import reportes from "../routes/reports/reportes.routes.js"
import esterilizaciones from "../routes/services/esterilizaciones.routes.js"
import propietarios from "../routes/owners/propietarios.routes.js"
import adopciones from "../routes/adoption/adoption.routes.js"
import defunciones from "../routes/deaths/deaths.routes.js"
import cremaciones from "../routes/cremations/cremations.routes.js"
import insumos from "../routes/inventory/supplies.routes.js"
import mordeduras from "../routes/bites/bites.routes.js"

// App
const app = express();

// Puerto
app.set("port", process.env.PORT || 3002);

// Configuraciones del cors
const corsOptions = {
    origin: [
        "http://localhost:3000",
        "http://localhost:8080",
        "http://10.10.250.31:3000",
        "http://10.10.250.31:3030",
        "http://10.10.250.31:8080",
        "http://10.10.250.31:8090"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Rutas
app.use("/sica",
    animales,
    vaccinations,
    consultations,
    usuarios,
    roles,
    medicamentos,
    alimentos,
    reportes,
    esterilizaciones,
    propietarios,
    adopciones,
    defunciones,
    cremaciones,
    insumos,
    mordeduras
);

// Endpoint para validar la actividad del server
app.use("/serverAlive", (req, res) => {
    res.status(200).json({ message: `Servidor corriendo en el puerto ${app.get("port")}` })
})

// Servidor
app.listen(app.get("port"), () => {
    console.log(`Server corriendo en el puerto ${app.get("port")}`);
})