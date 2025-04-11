const mongoose = require('mongoose');
const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');

// Configura Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Obtener todos los productos
const getProducts = async (req, res) => {
  try {
    const filter = req.query.category ? { category: req.query.category } : {};
    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
};

// Obtener producto por ID
const getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de producto no es válida' });
    }
    const product = await Product.findById(id);
    if (product) {
      return res.json(product);
    } else {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    return res.status(500).json({ message: "Error al obtener el producto", error: error.message });
  }
};

// Crear producto
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      countInStock,
      category,
      availableSizes,
      availableColors,
      images,
    } = req.body;

    // Validación más estricta
    if (
      !name || !description || !price || !countInStock || !category ||
      !images || !Array.isArray(images) || images.length === 0 ||
      images.some(img => typeof img !== 'string' || !img.startsWith('https://'))
    ) {
      return res.status(400).json({ message: "Faltan campos requeridos o las imágenes no son válidas" });
    }

    const product = new Product({
      name,
      description,
      price,
      countInStock,
      category,
      availableSizes,
      availableColors,
      images,
    });

    const createdProduct = await product.save();
    console.log("✅ Producto creado con imágenes válidas:", createdProduct);
    return res.status(201).json(createdProduct);
  } catch (error) {
    console.error("❌ Error en createProduct:", error);
    return res.status(500).json({ message: 'Error al crear el producto', error: error.message });
  }
};

// Actualizar producto
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = req.body.name || product.name;
      product.description = req.body.description || product.description;
      product.price = req.body.price || product.price;
      product.countInStock = req.body.countInStock || product.countInStock;
      product.images = req.body.images || product.images;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el producto' });
  }
};

// Eliminar producto (y sus imágenes en Cloudinary)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    if (product.images && product.images.length > 0) {
      for (let image of product.images) {
        const publicId = image.split('/').pop().split('.')[0];
        try {
          await cloudinary.uploader.destroy(publicId);
          console.log(`🗑️ Imagen eliminada: ${image}`);
        } catch (error) {
          console.error("Error al eliminar la imagen de Cloudinary:", error);
        }
      }
    }

    await product.deleteOne();
    res.json({ message: 'Producto y sus imágenes eliminados' });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ message: 'Error al eliminar el producto', error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
