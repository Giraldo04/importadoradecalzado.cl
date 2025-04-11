// backend/middlewares/uploadMiddleware.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'productos', // opcional: nombre de carpeta
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
  },
});

const upload = multer({ storage });

module.exports = upload;
