// src/components/Header.js
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import Sidebar from './Sidebar';

const Header = () => {
  const { cartItems } = useContext(CartContext);
  const { userInfo, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Calcular la cantidad total de ítems en el carrito
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Función para manejar el cierre de sesión y redirigir al inicio
  const handleLogout = () => {
    logout();
    navigate('/'); // Redirige a la página de inicio
  };

  return (
    <>
      <header className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Botón para abrir el sidebar en móviles */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-white focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo y nombre */}
          <Link to="/" className="flex items-center">
            <img src="/logocalzadocl.png" alt="Logo Importadoradecalzado.cl" className="w-10 h-10 mr-2" />
            <span className="text-2xl font-bold">Importadora de Calzado CL</span>
          </Link>

          {/* Menú de navegación para pantallas medianas y grandes */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-white hover:text-gray-300">
              Inicio
            </Link>
            <Link to="/productos/hombres" className="text-white hover:text-gray-300">
              Hombres
            </Link>
            <Link to="/productos/mujeres" className="text-white hover:text-gray-300">
              Mujeres
            </Link>
            <Link to="/cart" className="relative text-white hover:text-gray-300">
              Carrito
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-semibold rounded-full px-2 py-0.5">
                  {totalItems}
                </span>
              )}
            </Link>
            {userInfo && !userInfo.isAdmin && (
              <Link to="/profile" className="text-white hover:text-gray-300">
                Mi Cuenta
              </Link>
            )}
            {userInfo && userInfo.isAdmin && (
              <div className="relative group">
                <button className="text-white hover:text-gray-300 px-4 py-2">
                  Admin
                </button>
                <div className="hidden group-hover:block absolute top-full left-0 py-2 w-56 bg-white text-gray-900 border rounded shadow-xl transition-all duration-150 z-10">
                  <Link to="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-200">
                    Dashboard
                  </Link>
                  <Link to="/admin/productlist" className="block px-4 py-2 hover:bg-gray-200">
                    Gestión Productos
                  </Link>
                  <Link to="/admin/product/create" className="block px-4 py-2 hover:bg-gray-200">
                    Crear Producto
                  </Link>
                  <Link to="/admin/orderlist" className="block px-4 py-2 hover:bg-gray-200">
                    Órdenes
                  </Link>
                  <Link to="/admin/userlist" className="block px-4 py-2 hover:bg-gray-200">
                    Usuarios
                  </Link>
                  <Link to="/admin/delivery-settings" className="block px-4 py-2 hover:bg-gray-200">
                    Configuración Envío
                  </Link>
                </div>
              </div>
            )}
            {!userInfo && (
              <>
                <Link to="/register" className="text-white hover:text-gray-300">
                  Crear Cuenta
                </Link>
                <Link to="/login" className="text-white hover:text-gray-300">
                  Iniciar Sesión
                </Link>
              </>
            )}
            {userInfo && (
              <button onClick={handleLogout} className="text-red-600 hover:text-red-800 focus:outline-none">
                Cerrar Sesión
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Sidebar para dispositivos móviles */}
      {sidebarOpen && <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />}
    </>
  );
};

export default Header;
