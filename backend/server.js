// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

// Inicializar Express
const app = express();

// ✅ Middleware manual para CORS (antes de cualquier otro)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://importadaradecalzado.cl');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204); // No Content
  }
  next();
});

// ✅ CORS usando cors() también (por compatibilidad con otros libs)
app.use(cors({
  origin: ['https://importadaradecalzado.cl', 'https://www.importadaradecalzado.cl'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const adminUserRoutes = require('./routes/adminUserRoutes');
const productRoutes = require('./routes/productRoutes');
const deliverySettingsRoutes = require('./routes/deliverySettingsRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/products', productRoutes);
app.use('/api/delivery-settings', deliverySettingsRoutes);
app.use('/api/uploads', uploadRoutes);

// Archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Swagger
const { swaggerUi, swaggerDocs } = require('./swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Bienvenido a ImportadoraSGPlas API');
});

// Middleware para rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Middleware de errores
const { errorHandler } = require('./middlewares/errorMiddleware');
app.use(errorHandler);

// Servidor
const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = server;
