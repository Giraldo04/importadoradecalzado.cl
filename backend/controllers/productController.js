// backend/controllers/productController.js
const mongoose = require('mongoose');
const Product = require('../models/Product');

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

// Función para crear un producto (se puede restringir a admin)
const createProduct = async (req, res) => {
  try {
    console.log("Datos recibidos (body):", req.body);
    console.log("Archivos recibidos:", req.files);

    const { name, description, price, countInStock, category } = req.body;
    
    // Verifica que se envíe el campo category
    if (!category) {
      return res.status(400).json({ message: "El campo 'category' es requerido" });
    }
    
    // Convertir tallas y colores enviados como JSON strings a arrays
    let availableSizes = [];
    let availableColors = [];
    if (req.body.availableSizes) {
      availableSizes = JSON.parse(req.body.availableSizes);
    }
    if (req.body.availableColors) {
      availableColors = JSON.parse(req.body.availableColors);
    }
    
    // Extraer las rutas de los archivos subidos
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Al menos una imagen es obligatoria" });
    }
    const images = req.files.map(file => `uploads/${file.filename}`);

    const product = new Product({
      name,
      description,
      price,
      countInStock,
      images, // Guardamos un array de rutas de imágenes
      category,
      availableSizes,
      availableColors,
    });

    const createdProduct = await product.save();
    console.log("Producto creado:", createdProduct);
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
    if (product) {
      // Antes: await product.remove();
      // Ahora:
      await product.deleteOne(); 
      // o: await Product.deleteOne({ _id: product._id });

      return res.json({ message: 'Producto eliminado' });
    } else {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    return res.status(500).json({ message: 'Error al eliminar el producto' });
  }
};


module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
