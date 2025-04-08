// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Define la carpeta de uploads (asegúrate de que exista o créala)
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuración de Multer para guardar rutas relativas
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Genera un nombre único
    const filename = Date.now() + '-' + file.originalname;
    // Guarda la ruta relativa (ej.: "uploads/filename")
    cb(null, filename);
  },
});
const upload = multer({ storage });

router.get('/', getProducts);
router.get('/:id', getProductById);

// Asegúrate de que en la ruta se use el campo "images"
router.post('/', protect, admin, upload.array('images', 5), createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
