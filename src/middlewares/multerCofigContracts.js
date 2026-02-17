import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Crear carpeta si no existe
const uploadPath = "uploads/contracts";
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadPath),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + '-' + file.fieldname + ext);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg", "application/pdf"];
        if (!allowed.includes(file.mimetype)) {
            return cb(new Error("Formato de imagen no permitido"), false);
        }
        cb(null, true);
    }
});

export default upload;
