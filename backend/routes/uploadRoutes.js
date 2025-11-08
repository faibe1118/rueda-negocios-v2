const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

router.post("/", upload.single("file"), (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file" });
    const folder = req.body.folder || "";
    // construir URL accesible por HTTP
    const url = `${req.protocol}://${req.get("host")}/uploads/${folder}/${req.file.filename}`;
    res.json({ url });
});

module.exports = router;
