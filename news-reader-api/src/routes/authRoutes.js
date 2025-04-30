const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas
router.post('/register', register);
router.post('/login', login);

//Ruta protegida de prueba
router.get('/profile', authMiddleware, (req, res) => {
  res.json({
    message: 'Acceso permitido ✅',
    userId: req.user.id,
  });
});

router.put('/interests', authMiddleware, async (req, res) => {
  try {
    const { interests } = req.body;

    if (!interests || !Array.isArray(interests)) {
      return res.status(400).json({ message: 'Intereses inválidos' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { interests },
      { new: true }
    );

    res.status(200).json({
      message: 'Intereses actualizados correctamente',
      interests: user.interests,
    });
  } catch (error) {
    console.error('Error al actualizar intereses:', error.message);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;
