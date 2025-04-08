// src/context/CartContext.js
import React, { createContext, useEffect, useState } from 'react';

// Creamos el contexto
export const CartContext = createContext();

// Componente proveedor del contexto
export const CartProvider = ({ children }) => {
  // Inicializa el estado del carrito leyendo localStorage, si existe
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem('cartItems');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Error al parsear el carrito de localStorage:", error);
      return [];
    }
  });

  // Cada vez que el carrito cambie, se actualiza localStorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Función para agregar un producto al carrito
  const addToCart = (product) => {
    console.log("Producto que llega a addToCart:", product);
    // Verificamos si el producto ya existe en el carrito
    const existItem = cartItems.find((item) => item._id === product._id);
    if (existItem) {
      // Si ya existe, aumenta la cantidad
      setCartItems(cartItems.map((item) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      // Si no existe, se agrega con cantidad igual a 1
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  // Función para eliminar un producto del carrito (uno en uno)
  const removeOneFromCart = (productId) => {
    const existItem = cartItems.find((item) => item._id === productId);
    if (existItem && existItem.quantity > 1) {
      setCartItems(cartItems.map((item) =>
        item._id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ));
    } else {
      setCartItems(cartItems.filter((item) => item._id !== productId));
    }
  };

  // Función para remover completamente un producto del carrito
  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter((item) => item._id !== productId));
  };

  // Función para vaciar el carrito
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeOneFromCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
