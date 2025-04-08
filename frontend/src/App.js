// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';


import ProductDetailPage from './pages/ProductDetailPage';
import WomenProductsPage from './pages/WomenProductsPage';
import AdminRoute from './components/AdminRoute';
import AdminProductListPage from './pages/AdminProductListPage';
import AdminProductCreatePage from './pages/AdminProductCreatePage';
import AdminProductEditPage from './pages/AdminProductEditPage';
import AdminOrderListPage from './pages/AdminOrderListPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUserListPage from './pages/AdminUserListPage';
import AdminUserEditPage from './pages/AdminUserEditPage';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductosPage from './pages/ProductosPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import ProfilePage from './pages/ProfilePage';
import AdminDeliverySettingsPage from './pages/AdminDeliverySettingsPage';
import OrderDetailPage from './pages/OrderDetailPage';
import MenProductsPage from './pages/MenProductsPage';
import TransferConfirmationPage from './pages/TransferConfirmationPage';


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Header />
          <main className="container mx-auto px-4 py-6">
            <Routes>  

              {/* Rutas públicas */}
              <Route path="/" element={<HomePage />} />
              <Route path="/productos" element={<ProductosPage />} />
              <Route path="/productos/hombres" element={<MenProductsPage />} />
              <Route path="/productos/mujeres" element={<WomenProductsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/productos/:id" element={<ProductDetailPage />} />
              <Route path="/order/:id" element={<OrderDetailPage />} />
              <Route path="/transfer-confirmation" element={<TransferConfirmationPage />} />
              
              {/* RUTAS DE ADMINISTRACION */}

            

              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>  
                    <AdminDashboardPage />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/productlist"
                element={
                  <AdminRoute>
                    <AdminProductListPage />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/product/create"
                element={
                  <AdminRoute>
                    <AdminProductCreatePage />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/product/:id/edit"
                element={
                  <AdminRoute>
                    <AdminProductEditPage />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/delivery-settings"
                element={
                  <AdminRoute>
                    <AdminDeliverySettingsPage />
                  </AdminRoute>
                }
              />  

              

              {/* RUTAS DE ADMINISTRACION PARA ORDENES */}

              <Route
                path="/admin/orderlist"
                element={
                  <AdminRoute>
                    <AdminOrderListPage />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/order/:id"
                element={
                  <AdminRoute>
                    <OrderDetailPage />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/userlist"
                element={
                  <AdminRoute>
                    <AdminUserListPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/user/:id/edit"
                element={
                  <AdminRoute>
                    <AdminUserEditPage />
                  </AdminRoute>
                }
              />

              {/* Aquí puedes agregar más rutas de administración para gestionar usuarios u otros módulos */}
            </Routes>
          </main>
          <Footer />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
