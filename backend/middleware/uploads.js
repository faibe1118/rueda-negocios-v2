const multer = require("multer");
const path = require("path");
const fs = require("fs");

// almacenamiento con subcarpetas por 'folder' enviado en formData
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = req.body.folder || "uploads";
        const uploadPath = path.join(__dirname, "..", "uploads", folder);
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
        cb(null, name);
    }
});

const upload = multer({ storage });
module.exports = upload;
