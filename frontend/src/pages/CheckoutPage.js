// src/pages/CheckoutPage.js
import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ChileAddressForm from '../components/ChileAddressForm';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_API_URL;

  // Estado para configuración de entrega
  const [deliverySettings, setDeliverySettings] = useState(null);
  // Método de envío: 'pickup' o 'delivery'
  const [shippingMethod, setShippingMethod] = useState('pickup');
  // Datos de dirección: para "delivery" (manual o prellenados); para "pickup" se usará la dirección de retiro
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    houseNumber: '',
    apartment: '',
    commune: '',
    region: '',
  });
  // Estado para el método de pago: "transfer" o "transbank"
  const [paymentMethod, setPaymentMethod] = useState('transfer');
  const [error, setError] = useState('');

  // Calcular subtotal sin envío
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Cargar configuración de entrega desde el backend
  useEffect(() => {
    const fetchDeliverySettings = async () => {
      try {
        const res = await fetch(`${baseURL}/delivery-settings`);
        const data = await res.json();
        setDeliverySettings(data);
      } catch (err) {
        console.error('Error al cargar configuración de entrega:', err);
      }
    };
    fetchDeliverySettings();
  }, [baseURL]);

  // Prellenar la dirección si el usuario tiene direcciones guardadas
  useEffect(() => {
    if (userInfo && userInfo.shippingAddresses && userInfo.shippingAddresses.length > 0) {
      const defaultAddress =
        userInfo.shippingAddresses.find(addr => addr.default) ||
        userInfo.shippingAddresses[0];
      setShippingAddress(defaultAddress);
    }
  }, [userInfo]);

  // Costo de envío (solo si se elige "delivery")
  const shippingCost =
    shippingMethod === 'delivery' && deliverySettings
      ? Number(deliverySettings.shippingPrice ?? 0)
      : 0;

  // Total con envío incluido
  const totalPrice = subtotal + shippingCost;

  // Construir la dirección final:
  // - Si se eligió "delivery", se usan los datos ingresados (o prellenados).
  // - Si se eligió "pickup", se usa la dirección de retiro de la configuración.
  const finalShippingAddress =
    shippingMethod === 'delivery'
      ? {
          street: shippingAddress.street,
          houseNumber: shippingAddress.houseNumber,
          apartment: shippingAddress.apartment,
          commune: shippingAddress.commune,
          region: shippingAddress.region,
        }
      : {
          street: deliverySettings?.localPickupAddress,
        };

  // Función para iniciar el pago con Transbank
  const handlePayment = async (order) => {
    console.log('Order ID en handlePayment:', order._id);
    try {
      const resPayment = await fetch(`${baseURL}/payments/transbank/init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          buyOrder: order._id,    // Se usa el ID de la orden
          sessionId: userInfo._id,  // ID del usuario o sesión
          amount: order.totalPrice,
        }),
      });
      const paymentData = await resPayment.json();
      if (resPayment.ok) {
        window.location.href = paymentData.url + '?token_ws=' + paymentData.token;
      } else {
        alert(paymentData.message || 'Error al iniciar el pago');
      }
    } catch (err) {
      console.error('Error al iniciar el pago:', err);
      setError('Error al iniciar el pago');
    }
  };

  // Función para iniciar el pago por transferencia
  const handleTransferPayment = async (order) => {
    try {
      const resPayment = await fetch(`${baseURL}/payments/transfer/init`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      const paymentData = await resPayment.json();
      if (resPayment.ok) {
        // Redirige a la vista de confirmación de transferencia, pasando el orderId
        navigate(`/transfer-confirmation?orderId=${order._id}`);
      } else {
        alert(paymentData.message || 'Error al iniciar el pago');
      }
    } catch (err) {
      console.error('Error al iniciar el pago por transferencia:', err);
      setError('Error al iniciar el pago');
    }
  };

  // Función para crear la orden y luego iniciar el pago según el método elegido
  const handleOrder = async () => {
    if (!userInfo) {
      alert('Debes iniciar sesión para continuar');
      return;
    }

    // Construir items de la orden (incluyendo opciones de talla y color)
    const orderItems = cartItems.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      image: item.image || (item.images && item.images.length > 0 ? item.images[0] : ''),
      price: item.price,
      product: item._id,
      selectedSize: item.selectedSize || '',
      selectedColor: item.selectedColor || '',
    }));

    try {
      const resOrder = await fetch(`${baseURL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          orderItems,
          shippingMethod,
          shippingAddress: finalShippingAddress,
          paymentMethod: paymentMethod, // Envía el método de pago seleccionado
          totalPrice,
        }),
      });
      const orderData = await resOrder.json();
      if (resOrder.ok) {
        clearCart();
        // Según el método de pago, se llama a la función correspondiente
        if (paymentMethod === 'transfer') {
          await handleTransferPayment(orderData);
        } else {
          await handlePayment(orderData);
        }
      } else {
        alert(orderData.message || 'Error al crear la orden');
      }
    } catch (err) {
      console.error('Error al crear la orden:', err);
      setError('Error al crear la orden');
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h2 className="text-3xl font-bold mb-6">Checkout</h2>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Columna Izquierda: Datos de envío o retiro */}
        <div className="md:w-2/3 bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">Opciones de Entrega</h3>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Método de entrega:</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="shippingMethod"
                  value="pickup"
                  checked={shippingMethod === 'pickup'}
                  onChange={() => setShippingMethod('pickup')}
                />
                <span>Retiro en Local</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="shippingMethod"
                  value="delivery"
                  checked={shippingMethod === 'delivery'}
                  onChange={() => setShippingMethod('delivery')}
                />
                <span>Envío a Domicilio</span>
              </label>
            </div>
          </div>

          {shippingMethod === 'delivery' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold">Calle</label>
                <input
                  type="text"
                  value={shippingAddress.street}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, street: e.target.value })
                  }
                  className="w-full border rounded p-2 mt-1"
                  placeholder="Ej: Av. Siempre Viva"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold">Nº Casa</label>
                <input
                  type="text"
                  value={shippingAddress.houseNumber}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, houseNumber: e.target.value })
                  }
                  className="w-full border rounded p-2 mt-1"
                  placeholder="Ej: 123"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold">Depto (opcional)</label>
                <input
                  type="text"
                  value={shippingAddress.apartment}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, apartment: e.target.value })
                  }
                  className="w-full border rounded p-2 mt-1"
                  placeholder="Ej: 2B"
                />
              </div>
              {/* Utilizamos ChileAddressForm para región y comuna */}
              <div className="col-span-2">
                <ChileAddressForm address={shippingAddress} setAddress={setShippingAddress} />
              </div>
            </div>
          )}

          {shippingMethod === 'pickup' && deliverySettings && (
            <div className="mt-4">
              <p className="font-semibold">Dirección de Retiro:</p>
              <p>{deliverySettings.localPickupAddress}</p>
            </div>
          )}

          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>

        {/* Columna Derecha: Resumen de la orden y selección de método de pago */}
        <div className="md:w-1/3 bg-white p-4 rounded shadow flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-4">Resumen de la Orden</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {shippingMethod === 'delivery' && deliverySettings && (
                <div className="flex justify-between">
                  <span>Costo de Envío</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold border-t pt-2 mt-2">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            {/* Selección del método de pago */}
            <div className="mt-6">
              <p className="font-semibold mb-2">Método de Pago</p>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="transfer"
                    checked={paymentMethod === 'transfer'}
                    onChange={() => setPaymentMethod('transfer')}
                  />
                  <span>Transferencia Bancaria</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="transbank"
                    checked={paymentMethod === 'transbank'}
                    onChange={() => setPaymentMethod('transbank')}
                  />
                  <span>Transbank</span>
                </label>
              </div>
            </div>
          </div>
          <button
            onClick={handleOrder}
            className="mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Confirmar Orden y Pagar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
