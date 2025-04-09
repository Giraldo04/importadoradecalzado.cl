// src/pages/OrderDetailPage.js
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaWhatsapp } from 'react-icons/fa';

const OrderDetailPage = () => {
  const { id } = useParams();
  const { userInfo } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const baseURL = process.env.REACT_APP_API_URL;

  // Número de WhatsApp de la empresa (sin + ni espacios). Ejemplo: '56912345678'
  const companyWhatsapp = '56984748840';

  useEffect(() => {
    if (!userInfo) return; // Esperamos a que userInfo esté disponible
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${baseURL}/orders/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        if (!res.ok) {
          throw new Error('Error al obtener la orden');
        }
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchOrder();
  }, [id, userInfo, baseURL]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!order) return <p>Cargando orden...</p>;

  // Construye el mensaje y URL para WhatsApp
  const whatsappMessage = `Hola, necesito asistencia con mi orden ${order._id}.`;
  const whatsappUrl = `https://wa.me/${companyWhatsapp}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Detalle de la Orden</h2>
      <p><strong>Orden ID:</strong> {order._id}</p>
      <p><strong>Método de Envío:</strong> {order.shippingMethod}</p>
      {order.shippingMethod === 'delivery' ? (
        <>
          <p><strong>Dirección de Envío:</strong></p>
          <p>Calle: {order.shippingAddress?.street}</p>
          <p>Nº Casa: {order.shippingAddress?.houseNumber}</p>
          <p>Depto: {order.shippingAddress?.apartment}</p>
          <p>Comuna: {order.shippingAddress?.commune}</p>
          <p>Región: {order.shippingAddress?.region}</p>
        </>
      ) : (
        <p><strong>Dirección de Retiro:</strong> {order.shippingAddress?.street}</p>
      )}
      <p><strong>Estado de Pago:</strong> {order.isPaid ? 'Pagada' : 'Pendiente'}</p>
      <p><strong>Total:</strong> ${order.totalPrice?.toFixed(2)}</p>

      <h3 className="text-xl font-semibold mt-4 mb-2">Items de la Orden</h3>
      <ul className="list-disc pl-5">
        {order.orderItems.map((item, index) => (
          <li key={index} className="mb-1">
            {item.name} - Cantidad: {item.quantity} - Precio: ${item.price}
            {item.selectedSize && <span> - Talla: {item.selectedSize}</span>}
            {item.selectedColor && <span> - Color: {item.selectedColor}</span>}
          </li>
        ))}
      </ul>

      {/* Icono de WhatsApp para soporte */}
      <div className="mt-6">
        <a 
          href={whatsappUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center space-x-2 text-green-600"
        >
          <FaWhatsapp className="text-3xl" />
          <span className="text-lg font-semibold">Soporte vía WhatsApp</span>
        </a>
      </div>
    </div>
  );
};

export default OrderDetailPage;
