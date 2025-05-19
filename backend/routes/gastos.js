const express = require('express');
const router = express.Router();
const gastoController = require('../controllers/gastoController');

router.post('/', gastoController.crearGasto);
router.get('/por-fechas', gastoController.obtenerGastosPorFechas);
router.get('/', gastoController.obtenerTodosLosGastos);

module.exports = router;
