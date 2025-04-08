// src/pages/TransferConfirmationPage.js
import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const TransferConfirmationPage = () => {
  const [transferData, setTransferData] = useState(null);
  const [error, setError] = useState('');
  const { userInfo } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    const fetchTransferData = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/payments/transfer/init', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setTransferData(data.transferData);
        } else {
          setError(data.message || 'Error al obtener datos de transferencia');
        }
      } catch (err) {
        console.error('Error al obtener datos de transferencia:', err);
        setError('Error al obtener datos de transferencia');
      }
    };

    fetchTransferData();
  }, [userInfo]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold mb-6">Datos de Transferencia</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {transferData ? (
        <div className="border p-4 rounded shadow">
          <p><strong>Banco:</strong> {transferData.bank}</p>
          <p><strong>Número de Cuenta:</strong> {transferData.accountNumber}</p>
          <p><strong>Tipo de Cuenta:</strong> {transferData.accountType}</p>
          <p><strong>RUT:</strong> {transferData.rut}</p>
          <p><strong>Beneficiario:</strong> {transferData.beneficiary}</p>
          <p className="mt-4 text-blue-600">
            Para confirmar tu compra, envía una captura de pantalla del comprobante de transferencia a: <strong>{transferData.confirmationEmail}</strong>
          </p>
          <p className="mt-4 text-blue-600">
            Te confirmaremos la recepción de tu pago a través de un mensaje por correo electronico.
          </p>
          <Link to="/" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Volver al Inicio
          </Link>
        </div>
      ) : (
        <p>Cargando datos de transferencia...</p>
      )}
    </div>
  );
};

export default TransferConfirmationPage;
