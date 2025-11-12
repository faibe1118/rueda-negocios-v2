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

// Registro
router.post("/register", upload.any(), validateRegister, registerUser);

// Login
router.post("/login", loginUser);

// Perfil (solo con token)
router.get("/profile", protect, getProfile);

// Actualizar perfil (requiere token)
router.put("/update", protect, validateUpdateUser, updateProfile);

router.delete("/:id", protect, deleteUser);

module.exports = router;
