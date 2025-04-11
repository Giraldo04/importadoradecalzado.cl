// src/components/Sidebar.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { userInfo, logout } = useContext(AuthContext);

  // Menú general (visible para todos los usuarios y visitantes)
  const generalMenu = [
    { name: 'Inicio', path: '/' },
    { name: 'Productos', path: '/productos' },
    { name: 'Carrito', path: '/cart' },
  ];

  // Menú adicional para usuarios no admin
  const userMenu = [
    { name: 'Mi Cuenta', path: '/profile' },
    // Agrega más rutas para usuarios si lo deseas
  ];

  // Menú exclusivo para administradores
  // (Renombramos 'Productos' para evitar duplicar el que hay en el generalMenu).
  const adminMenu = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Gestión Productos', path: '/admin/productlist' },
    { name: 'Crear Producto', path: '/admin/product/create' },
    { name: 'Órdenes', path: '/admin/orderlist' },
    { name: 'Usuarios', path: '/admin/userlist' },
    { name: 'Configuración Envío', path: '/admin/delivery-settings' },
  ];

  // Construción final del array de menús
  let menuItems = [...generalMenu];

  if (userInfo) {
    if (userInfo.isAdmin) {
      // Agregamos menú Admin si es administrador
      menuItems = [...menuItems, ...adminMenu];
    } else {
      // Agregamos menú usuario normal
      menuItems = [...menuItems, ...userMenu];
    }
    // Al final, agregamos la opción de Cerrar Sesión
    menuItems.push({ name: 'Cerrar Sesión', isLogout: true });
  } else {
    // Si no está logueado
    menuItems.push({ name: 'Crear Cuenta', path: '/register' });
    menuItems.push({ name: 'Iniciar Sesión', path: '/login' });
  }

  // Función para manejar click en cada ítem
  const handleItemClick = (item) => {
    // Cerrar el Sidebar
    onClose();
    // Si el ítem es de "Cerrar Sesión", llamamos a logout
    if (item.isLogout) {
      logout();
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold">Menú</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
          Cerrar
        </button>
      </div>
      <nav className="p-4">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className="mb-2">
              {item.isLogout ? (
                <button
                  onClick={() => handleItemClick(item)}
                  className="text-gray-700 hover:text-gray-900 w-full text-left"
                >
                  {item.name}
                </button>
              ) : (
                <Link
                  to={item.path}
                  onClick={() => handleItemClick(item)}
                  className="text-gray-700 hover:text-gray-900"
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
