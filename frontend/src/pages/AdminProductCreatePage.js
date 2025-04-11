import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminProductCreatePage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [countInStock, setCountInStock] = useState(0);
  const [category, setCategory] = useState('men');
  const [files, setFiles] = useState([]);
  const [sizesInput, setSizesInput] = useState('');
  const [colorsInput, setColorsInput] = useState('');

  const baseURL = process.env.REACT_APP_API_URL;
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const folder = 'productos';

      // 1. Obtener firma segura desde tu backend
      const signRes = await fetch(`${baseURL}/uploads/sign?timestamp=${timestamp}&folder=${folder}`);
      const { signature, apiKey, cloudName } = await signRes.json();

      const imageUrls = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', apiKey);
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);
        formData.append('folder', folder);

        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData
        });

        const data = await uploadRes.json();
        imageUrls.push(data.secure_url);
      }

      const payload = {
        name,
        description,
        price,
        countInStock,
        category,
        availableSizes: sizesInput.split(',').map(s => s.trim()),
        availableColors: colorsInput.split(',').map(c => c.trim()),
        images: imageUrls
      };

      const res = await fetch(`${baseURL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        navigate('/admin/productlist');
      } else {
        const err = await res.json();
        alert(err.message || 'Error al crear el producto');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error al subir producto');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">Crear Producto</h2>
      <form onSubmit={handleSubmit}>
        {/* Campos del producto */}
        <input className="w-full mb-2 p-2 border" placeholder="Nombre" required value={name} onChange={(e) => setName(e.target.value)} />
        <textarea className="w-full mb-2 p-2 border" placeholder="Descripción" required value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="number" className="w-full mb-2 p-2 border" placeholder="Precio" required value={price} onChange={(e) => setPrice(e.target.value)} />
        <input type="number" className="w-full mb-2 p-2 border" placeholder="Stock" required value={countInStock} onChange={(e) => setCountInStock(e.target.value)} />
        
        <input type="file" multiple className="w-full mb-2 p-2 border" onChange={handleFileChange} />
        
        <select className="w-full mb-2 p-2 border" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="men">Hombres</option>
          <option value="women">Mujeres</option>
        </select>

        <input className="w-full mb-2 p-2 border" placeholder="Tallas (ej. 38,39,40)" value={sizesInput} onChange={(e) => setSizesInput(e.target.value)} />
        <input className="w-full mb-2 p-2 border" placeholder="Colores (ej. negro, blanco)" value={colorsInput} onChange={(e) => setColorsInput(e.target.value)} />

        <button type="submit" className="bg-green-600 text-white py-2 w-full mt-4 rounded hover:bg-green-700">Crear Producto</button>
      </form>
    </div>
  );
};

export default AdminProductCreatePage;
