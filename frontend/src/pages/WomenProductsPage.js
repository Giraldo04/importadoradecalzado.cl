// src/pages/WomenProductsPage.js
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import ImageCarousel from '../components/ImageCarousel';

const WomenProductsPage = () => {
  const [productos, setProductos] = useState([]);
  const { addToCart } = useContext(CartContext);
  const baseURL = process.env.REACT_APP_API_URL;


  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch(`${baseURL}/products?category=women`);
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error('Error al cargar productos para mujeres', error);
      }
    };
    fetchProductos();
  }, [baseURL]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold mb-10">Calzado para Mujeres</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {productos.map((producto) => (
          <div
            key={producto._id}
            className="product-card border p-8 rounded-lg shadow-xl hover:shadow-2xl transition transform hover:scale-105"
          >
            <Link to={`/productos/${producto._id}`}>
              <ImageCarousel
                images={
                  producto.images && producto.images.length > 0
                    ? producto.images.map(img => `http://localhost:5001/${img}`)
                    : ['/images/sample.jpg']
                }
                alt={producto.name}
                className="w-full h-96"
                showArrows={false}
              />
              <h3 className="mt-8 font-semibold text-3xl">{producto.name}</h3>
            </Link>
            <p className="text-gray-600 mb-6 text-2xl">${producto.price}</p>
            <button
              onClick={() => addToCart(producto)}
              className="mt-auto w-full bg-blue-600 text-white py-4 rounded hover:bg-blue-700 text-2xl"
            >
              Agregar al Carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WomenProductsPage;
