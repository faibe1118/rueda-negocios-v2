const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    deleteUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { validateRegister, validateUpdateUser } = require("../middleware/validator");
const upload = require("../middleware/upload");
const User = require("../models/User");

// Registro
router.post("/register", upload.any(), registerUser);

// Login
router.post("/login", loginUser);

// Perfil (solo con token)
router.get("/profile", protect, getProfile);

// Actualizar perfil (requiere token)
router.put("/update", protect, validateUpdateUser, updateProfile);

router.delete("/:id", protect, deleteUser);

// Obtener todos los usuarios (solo adminSistema)
router.get("/", protect, async (req, res) => {
    if (req.user.role !== "adminSistema") {
        return res.status(403).json({ message: "No autorizado" });
    }

    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener usuarios" });
    }
});

router.get("/:id", protect, async (req, res) => {
    try {
        if (req.user.role !== "adminSistema") {
            return res.status(403).json({ message: "No autorizado" });
        }

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        res.json(user);
    } catch (error) {
        console.error("❌ Error al obtener usuario:", error);
        res.status(500).json({ message: "Error interno" });
    }
});

//Cosas dirigidas al adminSistema
// Solo accesible por adminSistema
const { adminOnly } = require("../middleware/adminMiddleware");

// Obtener todos los usuarios (solo adminSistema)
router.get("/", protect, adminOnly, async (req, res) => {
    try {
        const users = await require("../models/User").find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuarios" });
    }
});

// Actualizar estado (aprobar o rechazar)
router.put("/:id/estado", protect, adminOnly, async (req, res) => {
    try {
        const user = await require("../models/User").findById(req.params.id);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        user.estado = req.body.estado;
        await user.save();

        res.json({ message: `Usuario ${req.body.estado} correctamente`, user });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar estado" });
    }
});


module.exports = router;
