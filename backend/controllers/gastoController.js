const Gasto = require('../models/gasto');

exports.crearGasto = async (req, res) => {
  try {
    const { descripcion, monto } = req.body;
    if (!descripcion || !monto) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    const gasto = new Gasto({ descripcion, monto });
    await gasto.save();

    res.status(201).json({ message: 'Gasto registrado correctamente.', gasto });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar gasto', error });
  }
};

exports.obtenerGastosPorFechas = async (req, res) => {
  const { desde, hasta } = req.query;
  try {
    const gastos = await Gasto.find({
      fecha: { $gte: new Date(desde), $lte: new Date(hasta) }
    });
    res.json(gastos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener gastos', error });
  }
};

exports.obtenerTodosLosGastos = async (req, res) => {
  try {
    const gastos = await Gasto.find();
    res.json(gastos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener gastos', error });
  }
};
