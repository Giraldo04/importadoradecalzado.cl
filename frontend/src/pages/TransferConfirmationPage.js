// src/pages/TransferConfirmationPage.js
import React, { useEffect, useState, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const TransferConfirmationPage = () => {
  const query = new URLSearchParams(useLocation().search);
  const orderId = query.get('orderId'); // Se extrae el orderId de la URL
  const { userInfo } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId || !userInfo) return; // Se requiere orderId y usuario para continuar
    const fetchOrder = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/orders/${orderId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        if (!res.ok) throw new Error('Error al obtener la orden');
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchOrder();
  }, [orderId, userInfo]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Confirmación de Transferencia</h2>
      {error && <p className="text-red-500">{error}</p>}
      {order ? (
        <div>
          <p className="mb-2">
            La orden <strong>{order._id}</strong> se registró correctamente mediante transferencia bancaria.
          </p>
          <p className="mb-2">
            Total: ${order.totalPrice.toFixed(2)}
          </p>
          <p className="mb-4">
            Para confirmar tu pago, envíanos una captura de pantalla del comprobante a nuestro correo.
          </p>
          <Link to="/" className="text-blue-600 hover:underline">
            Volver al Inicio
          </Link>
        </div>
      ) : (
        <p>Cargando detalles de la orden...</p>
      )}
    </div>
  );
};

export default TransferConfirmationPage;
