const express = require('express');
const { signup, login } = require('../controllers/authController');
const router = express.Router();

// Rutas de autenticación
router.post('/signup', signup); // Ruta para registrar usuarios
router.post('/login', login);   // Ruta para iniciar sesión

module.exports = router;
