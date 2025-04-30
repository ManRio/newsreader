const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    interests: {
      type: [String],
      default: [],
    },
    saved_articles: {
      type: [String], // IDs de artículos favoritos
      default: [],
    },
    read_history: {
      type: [String], // IDs de artículos leídos
      default: [],
    },
    language: {
      type: String,
      default: 'en',
    },
    notifications_enabled: {
      type: Boolean,
      default: true,
    },
    avatar: {
      type: String,
      default: '/uploads/default.png', // URL o ruta local del avatar
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
