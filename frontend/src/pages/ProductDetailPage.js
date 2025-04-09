// src/pages/ProductDetailPage.js
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import ImageCarousel from '../components/ImageCarousel';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const { addToCart } = useContext(CartContext);
  const baseURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${baseURL}/products/${id}`);
        if (!res.ok) throw new Error('Error al obtener el producto');
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, baseURL]);

  if (loading)
    return <div className="container mx-auto p-4">Cargando producto...</div>;
  if (error)
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  if (!product)
    return <div className="container mx-auto p-4">Producto no encontrado</div>;

  const handleAddToCart = () => {
    const productToCart = {
      ...product,
      selectedSize,
      selectedColor,
      quantity: 1,
    };
    addToCart(productToCart);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">{product.name}</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Carrusel de Imágenes */}
        <div className="md:w-1/2">
          <ImageCarousel
            images={
              product.images && product.images.length > 0
                ? product.images.map(img => `${baseURL.replace('/api','')}/${img}`)
                : ['/images/sample.jpg']
            }
            alt={product.name}
            className="w-full h-96" // Más alto para detalle
          />
        </div>

        {/* Detalles del Producto */}
        <div className="md:w-1/2">
          <p className="text-3xl font-bold text-blue-600 mb-6">${product.price}</p>
          <p className="mb-6 text-lg">{product.description}</p>
          <p className="mb-6 text-lg">
            <strong>Categoría:</strong> {product.category === 'men' ? 'Hombres' : 'Mujeres'}
          </p>

          {product.availableSizes && product.availableSizes.length > 0 && (
            <div className="mb-6">
              <label className="block font-semibold mb-2 text-lg">Selecciona una talla:</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full border rounded p-3 text-lg"
              >
                <option value="">Elige una talla</option>
                {product.availableSizes.map((size, idx) => (
                  <option key={idx} value={size}>{size}</option>
                ))}
              </select>
            </div>
          )}

          {product.availableColors && product.availableColors.length > 0 && (
            <div className="mb-6">
              <label className="block font-semibold mb-2 text-lg">Selecciona un color:</label>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full border rounded p-3 text-lg"
              >
                <option value="">Elige un color</option>
                {product.availableColors.map((color, idx) => (
                  <option key={idx} value={color}>{color}</option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white px-8 py-3 rounded hover:bg-blue-700 text-2xl"
          >
            Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
