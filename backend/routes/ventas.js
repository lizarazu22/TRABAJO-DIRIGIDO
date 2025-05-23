const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');
const upload = require('../middlewares/upload'); // 📌 este va en backend

router.post('/', upload.single('comprobante'), ventaController.crearVenta);
router.get('/por-usuario/:usuarioId', ventaController.obtenerVentasPorUsuario);
router.get('/por-fechas', ventaController.obtenerVentasPorFechas);
router.get('/filtrar', ventaController.obtenerVentasPorUsuarioYFechas);
router.get('/cierre-caja', ventaController.obtenerCierreCaja);
router.get('/resumen-mensual', ventaController.resumenMensual);
router.get('/recalcular-totales', ventaController.recalcularTotales);
router.get('/top-comprador', ventaController.topComprador);
router.get('/top-compradores', ventaController.topCompradores);
router.get('/', ventaController.obtenerTodasLasVentas);
router.put('/:id/estado', ventaController.cambiarEstadoVenta);

module.exports = router;
