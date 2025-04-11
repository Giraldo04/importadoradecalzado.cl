// src/pages/TransferConfirmationPage.js
import React, { useEffect, useState, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaWhatsapp } from 'react-icons/fa';

const TransferConfirmationPage = () => {
  const { userInfo } = useContext(AuthContext);
  const query = new URLSearchParams(useLocation().search);
  const orderId = query.get('orderId'); // Se extrae el orderId de la URL
  const [order, setOrder] = useState(null);
  const [transferData, setTransferData] = useState(null);
  const [error, setError] = useState('');
  const baseURL = process.env.REACT_APP_API_URL;

  const companyWhatsapp = '56984748840';

  const whatsappMessage = "Hola, necesito asistencia con mi orden";
  const whatsappUrl = `https://wa.me/${companyWhatsapp}?text=${encodeURIComponent(whatsappMessage)}`;


  // Obtener los detalles de la orden
  useEffect(() => {
    if (!orderId || !userInfo) return;
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${baseURL}/orders/${orderId}`, {
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
  }, [orderId, userInfo, baseURL]);

  // Obtener los datos de transferencia
  useEffect(() => {
    if (!userInfo) return;
    const fetchTransferData = async () => {
      try {
        const res = await fetch(`${baseURL}/payments/transfer/init`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        if (!res.ok) throw new Error('Error al obtener los datos de transferencia');
        const data = await res.json();
        setTransferData(data.transferData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTransferData();
  }, [userInfo, baseURL]);

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
            Para confirmar tu pago, envíanos una captura de pantalla del comprobante a nuestro correo. {transferData.confirmationEmail}
          </p>
          {transferData && (
            <div className="border p-4 rounded mb-4">
              <h3 className="text-xl font-semibold mb-2">Datos de Transferencia</h3>
              <p><strong>Banco:</strong> {transferData.bank}</p>
              <p><strong>N° de Cuenta:</strong> {transferData.accountNumber}</p>
              <p><strong>Tipo de Cuenta:</strong> {transferData.accountType}</p>
              <p><strong>RUT:</strong> {transferData.rut}</p>
              <p><strong>Beneficiario:</strong> {transferData.beneficiary}</p>
              <p><strong>Enviar comprobante a:</strong> {transferData.confirmationEmail}</p>
            </div>
          )}
          {/* Enlace de WhatsApp para soporte */}
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
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
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
