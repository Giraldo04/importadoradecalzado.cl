// backend/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
    },
    description: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
    },
    price: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      default: 0,
    },
    countInStock: {
      type: Number,
      required: [true, 'El stock es obligatorio'],
      default: 0,
    },
    images: {
      type: [String], // Array de URLs
      required: [true, 'Al menos una imagen es obligatoria'],
    },
    category: {
      type: String,
      enum: ['men', 'women'],
      required: [true, 'La categoría es obligatoria'],
    },
    availableSizes: {
      type: [String], // Ej.: ["38", "39", "40", ...]
      default: [],
    },
    availableColors: {
      type: [String], // Ej.: ["rojo", "azul", "negro"]
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
