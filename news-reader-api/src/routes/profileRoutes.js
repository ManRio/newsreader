const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const path = require('path');
const multer = require('multer');
const authMiddleware = require('../middlewares/authMiddleware');
const User = require('../models/User');

// Multer config para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + '-' + file.originalname;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!['.png', '.jpg', '.jpeg'].includes(ext)) {
      return cb(new Error('Solo se permiten imágenes (jpg, jpeg, png)'));
    }
    cb(null, true);
  },
});

// GET: Perfil de usuario
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user)
      return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({
      username: user.username,
      email: user.email,
      avatar: user.avatar?.startsWith('http')
        ? user.avatar
        : `${req.protocol}://${req.get('host')}${user.avatar}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// PUT: Actualizar perfil
router.put('/', authMiddleware, async (req, res) => {
  try {
    const updates = {};
    if (req.body?.username) updates.username = req.body.username;
    if (req.body?.email) updates.email = req.body.email;
    if (req.body?.avatar) updates.avatar = req.body.avatar;

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    }).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error actualizando perfil' });
  }
});

// PUT: Cambiar contraseña
router.put('/password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña actual incorrecta' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error cambiando la contraseña' });
  }
});

// POST: Subir avatar
router.post(
  '/upload-avatar',
  authMiddleware,
  upload.single('avatar'),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user)
        return res.status(404).json({ message: 'Usuario no encontrado' });

      user.avatar = `${req.protocol}://${req.get('host')}/uploads/${
        req.file.filename
      }`;
      await user.save();

      res.status(200).json({
        message: 'Avatar actualizado correctamente',
        avatar: user.avatar,
      });
    } catch (err) {
      console.error('Error subiendo avatar:', err);
      res.status(500).json({ message: 'Error al subir imagen' });
    }
  }
);

module.exports = router;
