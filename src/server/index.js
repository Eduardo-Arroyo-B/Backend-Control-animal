import express from 'express';
import cors from 'cors';

// SICA
import animales from "../routes/animals/animal.routes.js"
import vaccinations from "../routes/vaccionations/vaccinations.routes.js"
import consultations from "../routes/consultations/consultations.routes.js"

// App
const app = express();

// Puerto
app.set("port", process.env.PORT || 3000);

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

// Rutas
app.use("/animals", animales)
app.use("/vaccinations", vaccinations)
app.use("/consultations")

// Endpoint para validar la actividad del server
app.use("serverAlive", (req, res) => {
    res.status(200).json({ message: `Servidor corriendo en el puerto ${app.get("port")}` })
})

// Servidor
app.listen(app.get("port"), () => {
    console.log(`Server corriendo en el puerto ${app.get("port")}`);
})