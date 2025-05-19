const Usuario = require('../models/user');

exports.obtenerTodosLosUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('_id nombre email');
    res.status(200).json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios', error });
  }
};
