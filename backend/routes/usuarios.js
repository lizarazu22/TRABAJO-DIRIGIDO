const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

// Obtener todos los usuarios
router.get('/', usuariosController.obtenerTodosLosUsuarios);

// Actualizar un usuario
router.put('/:id', usuariosController.actualizarUsuario);

// Eliminar un usuario
router.delete('/:id', usuariosController.eliminarUsuario);

module.exports = router;
