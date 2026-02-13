import jwt from "jsonwebtoken";

const validarJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Token requerido" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Se deja en el req para futuros usos
        next();
    } catch (error) {
        return res.status(404).json({ message: "Token inválido o expirado" });
    }
};

export default validarJWT