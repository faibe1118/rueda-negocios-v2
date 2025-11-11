// backend/middleware/upload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// === CONFIGURAR ALMACENAMIENTO ===
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = "uploads/otros"; // carpeta por defecto

        // Clasificar por tipo de archivo
        if (file.fieldname.includes("logo")) folder = "uploads/logos";
        else if (file.mimetype === "application/pdf") folder = "uploads/docs";

        // Crear carpeta si no existe
        const dir = path.join(__dirname, "..", folder);
        fs.mkdirSync(dir, { recursive: true });

        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

// === FILTRO DE ARCHIVOS ===
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Tipo de archivo no permitido"), false);
    }
};

// === MIDDLEWARE FINAL ===
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // Máx 10MB
});

module.exports = upload;
