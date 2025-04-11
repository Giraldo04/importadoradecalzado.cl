// backend/controllers/productController.js
const mongoose = require('mongoose');
const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');



// Configura Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Función para obtener todos los productos
const getProducts = async (req, res) => {
  try {
    // Encuentra todos los documentos de la colección "products"
    let filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
      console.log('Filtro de categoría:', req.query.category);
    }
    const products = await Product.find(filter);
    // products será un array, aunque tengas 1 o 0 documentos
    res.json(products); 
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
};

// Función para obtener un producto por su ID
const getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    // Verifica que el id tenga un formato válido (24 caracteres hexadecimales)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de producto no es válida' });
    }
    console.log("Product ID recibido:", id);
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

// backend/controllers/productController.js
const createProduct = async (req, res) => {
  try {
    console.log("Datos recibidos (body):", req.body);

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

    if (!name || !description || !price || !countInStock || !category || !images || images.length === 0) {
      return res.status(400).json({ message: "Faltan campos requeridos o imágenes" });
    }

    const product = new Product({
      name,
      description,
      price,
      countInStock,
      category,
      availableSizes,
      availableColors,
      images, // Ya es un array de URLs de Cloudinary
    });

    const createdProduct = await product.save();
    console.log("Producto creado con imágenes en Cloudinary:", createdProduct);
    return res.status(201).json(createdProduct);

  } catch (error) {
    console.error("Error en createProduct:", error);
    return res.status(500).json({ message: 'Error al crear el producto', error: error.message });
  }
};



// Función para actualizar un producto
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = req.body.name || product.name;
      product.description = req.body.description || product.description;
      product.price = req.body.price || product.price;
      product.countInStock = req.body.countInStock || product.countInStock;
      product.image = req.body.image || product.image;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el producto' });
  }
};

// Función para eliminar un producto
// Función para eliminar un producto
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Elimina las imágenes de Cloudinary
    if (product.images && product.images.length > 0) {
      for (let image of product.images) {
        const publicId = image.split('/').pop().split('.')[0]; // Obtener el public_id de la URL
        try {
          await cloudinary.uploader.destroy(publicId); // Eliminar la imagen de Cloudinary
          console.log(`Imagen eliminada de Cloudinary: ${image}`);
        } catch (error) {
          console.error("Error al eliminar la imagen de Cloudinary:", error);
        }
      }
    }

    // Eliminar el producto de la base de datos
    await product.deleteOne();
    return res.json({ message: 'Producto y sus imágenes eliminados' });

  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    return res.status(500).json({ message: 'Error al eliminar el producto', error: error.message });
  }
};


module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
